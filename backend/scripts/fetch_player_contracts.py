import os
from time import sleep
from gazpacho import Soup, get
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
mongo = MongoClient(os.environ.get("DATABASE_URL"))
db = mongo.frostbite

column_name = {
    "caphit": "capHit",
    "p.bonuses": "playingBonuses",
    "s.bonuses": "signingBonuses",
    "basesalary": "baseSalary",
    "totalsalary": "totalSalary",
    "minorssal": "minorSalary",
}


def get_contract(id: int, name: str):
    url_name = name.replace(" ", "-")

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

    aav_chart["name"] = name
    aav_chart["playerId"] = id
    aav_chart = aav_chart.dropna(1)

    return aav_chart.to_dict(orient="records")


def update_db(id: int, name: str):
    contract_years = get_contract(id, name)
    # print(contract_years)
    if contract_years:
        db.playerContracts.insert_many(contract_years)


if __name__ == "__main__":
    players = list(
        db.mpSkaters.aggregate(
            [{"$group": {"_id": {"name": "$name", "playerId": "$playerId"}}}]
        )
    )

    contract_players = list(
        db.playerContracts.aggregate([{"$group": {"_id": "$playerId"}}])
    )
    contract_players = [int(p["_id"]) for p in contract_players]
    print(contract_players)

    players = [
        player
        for player in players
        if player["_id"]["playerId"] not in contract_players
    ]

    size = len(players)
    print(size)
    for index, player in enumerate(players):
        update_db(player["_id"]["playerId"], player["_id"]["name"])
        if index % 5 == 0:
            print(f"Completed {index/size} %")
            sleep(30)
