import numpy as np
from pandas.core.frame import DataFrame
from app import app
from app.utilities import get_lines_frame, get_player_frame, refactor_columns

lines_frame = get_lines_frame()
player_frame = get_player_frame()


# TODO add sorting
@app.route("/line/<number>")
@app.route("/line/<number>/<season>")
def get_lines(number, season="All"):
    line = lines_frame
    if not season == "All":
        line = line.loc[line["season"] == int(season)]
    line = line.head(int(number))
    return display_lines(line)


# TODO add options to select player
@app.route("/playerline/<name>")
@app.route("/playerline/<name>/<season>")
def get_player_line(name, season="All"):
    names = match_name(name, player_frame)

    if len(names.keys()) == 0:
        return {}

    teams: list[str] = []

    for key, value in names.items():
        teams.extend(list(find_teams(player_frame, int(key))))

    line = lines_frame[lines_frame["team"].str.contains("|".join(teams), regex=True)]
    line = line[
        line["name"].str.contains(
            "|".join([name.split(" ")[1] for name in names.values()]), case=False
        )
    ]

    if not season == "All":
        line = line.loc[line["season"] == int(season)]

    return display_lines(line)


def display_lines(lines_frame):
    refactor_columns(lines_frame)
    lines_frame.pop("season")
    lines_frame.pop("lineId")
    base_frame = lines_frame.iloc[:, np.r_[0:10, 11, 20, 23, 24, 33, 34, 81, 36, 72]]

    off_frame = lines_frame.iloc[:, np.r_[0:12, 20:28, 39:48, 52:55]]
    def_frame = lines_frame.iloc[:, np.r_[0:10, 33, 36:39, 51, 58:61, 68:78, 86:94, 97]]

    tables = {
        "base": base_frame.to_dict(orient="records"),
        "offense": off_frame.to_dict(orient="records"),
        "defense": def_frame.to_dict(orient="records"),
    }
    return tables


def find_teams(dataframe: DataFrame, player_id):
    """
    Returns all the teams a player has played for by matching the ID
    Args:
        dataframe:
            Panda datatable with player statistics
        player_id:
            Unique integer associated with a player by the NHL
    Returns:
        A set of strings containing team names
    """
    player_frame = dataframe.loc[dataframe["playerId"] == player_id]
    team_set = set()

    for team in player_frame["team"].tolist():
        team_set.add(team)

    return team_set


def match_name(name: str, dataframe: DataFrame):
    """
    Matches a player's name in the datatable to a user's search

    Args:
        user_input:
            String user search query
        dataframe:
            Panda datatable with player statistics

    Returns:
        A dictionary mapping a player name to an id
    """
    ids = {}
    temp_frame = dataframe.loc[dataframe["name"].str.contains(name.lower(), case=False)]
    for index, row in temp_frame.iterrows():
        if str(row["playerId"]) not in ids:
            ids[str(row["playerId"])] = row["name"]
    return ids
