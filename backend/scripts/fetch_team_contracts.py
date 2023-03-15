from time import sleep
import pandas as pd
from gazpacho import Soup, get
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()
mongo = MongoClient(os.environ.get("DATABASE_URL"))
db = mongo.frostbite
pd.options.mode.chained_assignment = None  # default='warn'

teams = {
    1: "New Jersey Devils",
    2: "New York Islanders",
    3: "New York Rangers",
    4: "Philadelphia Flyers",
    5: "Pittsburgh Penguins",
    6: "Boston Bruins",
    7: "Buffalo Sabres",
    8: "Montréal Canadiens",
    9: "Ottawa Senators",
    10: "Toronto Maple Leafs",
    12: "Carolina Hurricanes",
    13: "Florida Panthers",
    14: "Tampa Bay Lightning",
    15: "Washington Capitals",
    16: "Chicago Blackhawks",
    17: "Detroit Red Wings",
    18: "Nashville Predators",
    19: "St. Louis Blues",
    20: "Calgary Flames",
    21: "Colorado Avalanche",
    22: "Edmonton Oilers",
    23: "Vancouver Canucks",
    24: "Anaheim Ducks",
    25: "Dallas Stars",
    26: "Los Angeles Kings",
    28: "San Jose Sharks",
    29: "Columbus Blue Jackets",
    30: "Minnesota Wild",
    52: "Winnipeg Jets",
    53: "Arizona Coyotes",
    54: "Vegas Golden Knights",
    55: "Seattle Kraken",
}


def get_team_contracts(team_id):
    """
    Finds the contract details for the specified player and displays
    them in a line chart
    Args:
        name:
            String representing the team being searched for
    """
    name = teams[team_id]
    fullname = name.split(" ")
    url_name = fullname[1]
    if fullname[0].lower() in ["toronto", "columbus", "vegas", "detroit"]:
        url_name = fullname[1] + fullname[2]
    elif len(fullname) > 2:
        url_name = fullname[2]

    url = "https://www.capfriendly.com/teams/" + url_name
    html = Soup(get(url))
    results = pd.read_html(
        str(html.find("div", {"class": "cb team_c"}).find("table")), header=0
    )
    df = results[0].head(41)
    df.drop(df.columns[0], axis=1, inplace=True)
    first_column = df.columns[0].split(".")[0]
    df.rename(columns={df.columns[0]: first_column}, inplace=True)

    for column in df.columns[8:]:
        values = []
        for value in df[column]:
            if isinstance(value, str) and "$" in value:
                values.append(int(value.split("$")[1].replace(",", "")))
            else:
                values.append(value)
        df[column] = values

    # Finding row numbers
    # Rows in the table
    index_list = {df.columns[0]: 0}
    # TODO cleanup
    for i, row in enumerate(df.itertuples()):
        header = row[1]
        if isinstance(header, str) and header.isupper() and "TOTAL" not in header:
            index_list[header] = i

    keys = list(index_list.keys())
    values = list(index_list.values())
    dataframes = {}

    for i, ele in enumerate(keys):
        if "ACQUIRED" in ele:
            break
        if i < len(keys) - 1:
            temp_df = df.iloc[values[i] : values[i + 1] - 1]
        else:
            temp_df = df.iloc[values[i] :]
        if not i == 0:
            temp_df.columns = temp_df.iloc[0]
            temp_df = temp_df[1:]

        if "BUYOUT" in ele or "RETAINED" in ele or "RECAPTURE" in ele:
            temp_df = temp_df.loc[:, temp_df.columns.notnull()]
        else:
            temp_df[["TERMS", "ACQUIRED", "POS", "STATUS"]] = temp_df[
                ["TERMS", "ACQUIRED", "POS", "STATUS"]
            ].fillna("-")
        temp_df["YEARS REMAINING"] = temp_df["YEARS REMAINING"].fillna("-")
        temp_df = temp_df.fillna(0)
        dataframes[ele.split("(")[0].strip()] = temp_df.to_dict(orient="records")

    return {"name": name, "teamId": team_id, "contracts": dataframes}


if __name__ == "__main__":
    for tid in teams.keys():
        db.teamContracts.update_one(
            {"teamId": tid},
            {"$set": {"contracts": get_team_contracts(tid)["contracts"]}},
        )
        sleep(5)
