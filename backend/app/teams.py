from pandas.core.frame import DataFrame
from app import app, db
import pyarrow.feather as feather
import pandas as pd
from gazpacho import get
from flask import request
from app.utilities import refactor_columns
import pymongo

pd.options.mode.chained_assignment = None  # default='warn'
teams_frame: DataFrame = feather.read_feather("./data/teams")


@app.route("/")
def main_page():
    return "Hello World"


@app.route("/team/<name>")
@app.route("/team/<name>/<season>")
def get_team(name, season="All"):
    if season == "All":
        team_stats = list(db.mpTeams.find({"name": name}))
    else:
        team_stats = list(db.mpTeams.find({"name": name, "season": season}))
    team_stats = pd.DataFrame(team_stats)
    refactor_columns(team_stats)

    return {"stats": team_stats.to_dict(orient="records")}


@app.route("/teams/")
def get_teams():
    data = request.args.to_dict()
    team_stats = pd.DataFrame(
        list(
            db.mpTeams.find(
                {"season": int(data["season"]), "situation": data["situation"]},
                {"_id": 0, "season": 0, "team": 0, "position": 0},
            ).sort([("name", pymongo.ASCENDING)])
        )
    )
    refactor_columns(team_stats)

    return {"stats": team_stats.to_dict(orient="records")}


@app.route("/team/contracts/<team_id>")
def get_team_contracts(team_id):
    """
    Finds the contract details for the specified player and displays
    them in a line chart
    Args:
        name:
            String representing the team being searched for
    """
    contracts = db.teamContracts.find_one(
        {"teamId": int(team_id)}, {"_id": 0, "teamId": 0}
    )
    return contracts if contracts is not None else {}


@app.route("/draft/<year>")
def get_draft_year(year):
    draft = get(f"https://records.nhl.com/site/api/draft/?cayenneExp=draftYear={year}")[
        "data"
    ]
    lastRound = draft[len(draft) - 1]["roundNumber"]
    rounds = {}

    for i in range(1, lastRound + 1):
        rounds["Round" + str(i)] = [
            player for player in draft if player["roundNumber"] == i
        ]

    return rounds


@app.route("/team/seasons/<id>")
def get_team_seasons(id):
    return get(
        f"https://records.nhl.com/site/api/franchise-season-results?cayenneExp=teamId={id}&sort=seasonId&dir=DESC"
    )


@app.route("/franchise/<id>")
def get_franchise(id):
    return get(
        f"https://records.nhl.com/site/api/franchise?cayenneExp=mostRecentTeamId={id}"
    )


@app.route("/trophy")
def get_trophies():
    return get("https://records.nhl.com/site/api/trophy")
