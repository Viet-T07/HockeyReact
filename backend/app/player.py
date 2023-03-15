from app import app, db
from app.utilities import refactor_columns
from flask import request, abort
from pandas.core.frame import DataFrame
from gazpacho import Soup, get
import numpy as np
import pandas as pd
import pymongo

pd.options.mode.chained_assignment = None  # default='warn'


@app.route("/player/")
def get_player():
    data = request.args.to_dict()

    if "id" not in data:
        return abort(400)

    player = {}
    position = data["position"]
    name = data["name"]
    playerId = int(data["id"])

    if position == "Goalie":
        skater = list(
            db.mpGoalies.find(
                {"playerId": playerId, "situation": "all"},
                {"_id": 0, "playerId": 0, "name": 0},
            )
        )
        player = skater
    else:
        skater = list(
            db.mpSkaters.find(
                {"playerId": playerId, "situation": "all"},
                {"_id": 0, "playerId": 0, "name": 0},
            )
        )
        player = display_player(pd.DataFrame(skater))

    # Get Contract
    contracts = list(
        db.playerContracts.find(
            {"playerId": playerId},
            {"_id": 0, "name": 0, "playerId": 0, "contractId": 0},
        ).sort("season", pymongo.ASCENDING)
    )
    if len(contracts) > 0:
        player["contracts"] = contracts
    else:
        contract_years = get_contract(playerId, name)
        if not len(contract_years.index) == 0:
            contract = pd.DataFrame(contract_years)
            contract.drop(["name", "contractId", "playerId"], axis=1, inplace=True)
            player["contracts"] = contract.sort_values(by="season").to_dict(
                orient="records"
            )
            db.playerContracts.insert_many(contract_years.to_dict(orient="records"))
    return player


def display_player(player_frame: DataFrame):
    if len(player_frame.index) == 0:
        return {}
    refactor_columns(player_frame)
    player_frame.fillna(0, inplace=True)

    base_frame = player_frame.iloc[:, np.r_[0:7, 32, 25, 26, 31, 16, 10:15, 41, 66, 78]]

    off_frame = player_frame.iloc[
        :,
        np.r_[0:7, 32, 152, 153, 25, 26, 31, 16, 8:16, 27:31, 34:39, 47:56, 57, 79, 80],
    ]

    if "Faceoff Percentage" in player_frame.columns:
        def_frame = player_frame.iloc[
            :, np.r_[0:7, 10:15, 39:42, 154, 44:47, 59, 67:73, 78, 81]
        ]
    else:
        def_frame = player_frame.iloc[
            :, np.r_[0:7, 10:15, 39:42, 44:47, 59, 67:73, 78, 81]
        ]

    tables = {
        "base": base_frame.to_dict(orient="records"),
        "offense": off_frame.to_dict(orient="records"),
        "defense": def_frame.to_dict(orient="records"),
    }
    return tables


def get_contract(id: int, name: str):
    url_name = name.replace(" ", "-")
    column_name = {
        "caphit": "capHit",
        "p.bonuses": "playingBonuses",
        "s.bonuses": "signingBonuses",
        "basesalary": "baseSalary",
        "totalsalary": "totalSalary",
        "minorssal": "minorSalary",
        "contractid": "contractId",
    }
    # Scrape data from cap friendly
    url = "https://www.capfriendly.com/players/" + url_name
    html = Soup(get(url))
    if html.find("table") == None:
        return {}
    results = pd.read_html(str(html.find("table")), header=0)

    aav_chart = pd.DataFrame()
    for i, chart in enumerate(results[:-1]):
        chart = chart[:-1]
        chart["contractId"] = i
        if "SALARY" in chart.columns:
            chart = chart.iloc[:, ~chart.columns.str.contains("^unnamed", case=False)]
            chart.rename(columns={"SALARY": "TOTAL SALARY"}, inplace=True)
        chart = chart.replace("NHL LOCKOUT / 24% ROLLBACK FOLLOWS", -2)
        aav_chart = aav_chart.append(chart)
    aav_chart = aav_chart.replace(r"[$,]", "", regex=True)

    columns = aav_chart.columns

    if "CLAUSE" in columns:
        aav_chart["CLAUSE"].fillna("-", inplace=True)

    for column in columns:
        cur_column = column.replace(" ", "")
        cur_column = str.lower(cur_column)
        cur_column = (
            column_name[cur_column] if cur_column in column_name else cur_column
        )
        aav_chart.rename(
            columns={column: cur_column},
            inplace=True,
        )
        if "Salary" in cur_column:
            aav_chart[cur_column].replace("ENTRY-LEVEL SLIDE", -1, inplace=True)

        if cur_column == "playingBonuses":
            aav_chart[cur_column].replace(r"[–]", 0, inplace=True, regex=True)

        aav_chart[cur_column] = pd.to_numeric(aav_chart[cur_column], errors="ignore")

    column_move = aav_chart.pop("totalSalary")
    aav_chart["totalSalary"] = column_move
    aav_chart["name"] = name
    aav_chart["playerId"] = id
    aav_chart = aav_chart.dropna(axis=1, how="all")
    aav_chart = aav_chart.fillna(0)

    return aav_chart
