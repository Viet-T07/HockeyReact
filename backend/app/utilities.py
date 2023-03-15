from pandas.core.frame import DataFrame
import pyarrow.feather as feather

player_frame: DataFrame = feather.read_feather("./data/skaters")
goalie_frame: DataFrame = feather.read_feather("./data/goalies")
lines_frame: DataFrame = feather.read_feather("./data/lines")
lines_frame["season"] = lines_frame["season"].apply(str)
lines_frame["name"] = lines_frame["name"] + " " + lines_frame["season"]


def get_player_frame():
    return player_frame


def get_goalie_frame():
    return goalie_frame


def get_lines_frame():
    return lines_frame


def refactor_columns(dataframe: DataFrame):
    for column_name in dataframe.columns:
        refactor_column(dataframe, column_name)


def refactor_column(dataframe: DataFrame, column_name):
    # GOALIE STATS
    if column_name == "games_played":
        dataframe.rename(columns={column_name: "games played"}, inplace=True)
    elif column_name == "timeOnIce":
        dataframe.rename(columns={column_name: "time on ice (min)"}, inplace=True)
    # elif column_name == "icetime":  dataframe.renameame(columns = {column_name:'icetime (s)'}, inplace = True)
    elif column_name == "unblocked_shot_attempts":
        dataframe.rename(columns={column_name: "unblocked shot attempts"}, inplace=True)
    elif column_name == "ongoal":
        dataframe.rename(columns={column_name: "on goal"}, inplace=True)
    elif column_name == "playStopped":
        dataframe.rename(columns={column_name: "play stopped"}, inplace=True)
    elif column_name == "playContinuedInZone":
        dataframe.rename(columns={column_name: "play continued in zone"}, inplace=True)
    elif column_name == "playContinuedOutsideZone":
        dataframe.rename(
            columns={column_name: "play continued outside zone"}, inplace=True
        )
    elif column_name == "mediumDangerShots":
        dataframe.rename(columns={column_name: "medium danger shots"}, inplace=True)
    elif column_name == "lowDangerShots":
        dataframe.rename(columns={column_name: "low danger shots"}, inplace=True)
    elif column_name == "highDangerShots":
        dataframe.rename(columns={column_name: "high danger shots"}, inplace=True)
    elif column_name == "mediumDangerxGoals":
        dataframe.rename(columns={column_name: "medium danger xGoals"}, inplace=True)
    elif column_name == "highDangerxGoals":
        dataframe.rename(columns={column_name: "high danger xGoals"}, inplace=True)
    elif column_name == "lowDangerxGoals":
        dataframe.rename(columns={column_name: "low danger xGoals"}, inplace=True)
    elif column_name == "flurryAdjustedxGoals":
        dataframe.rename(columns={column_name: "flurry adjusted xGoals"}, inplace=True)
    elif column_name == "highDangerShots":
        dataframe.rename(columns={column_name: "high danger shots"}, inplace=True)
    elif column_name == "mediumDangerGoals":
        dataframe.rename(columns={column_name: "medium danger goals"}, inplace=True)
    elif column_name == "highDangerGoals":
        dataframe.rename(columns={column_name: "high danger goals"}, inplace=True)
    elif column_name == "lowDangerGoals":
        dataframe.rename(columns={column_name: "low danger goals"}, inplace=True)
    elif column_name == "blocked_shot_attempts":
        dataframe.rename(columns={column_name: "blocked shot attempts"}, inplace=True)
    elif column_name == "penalityMinutes":
        dataframe.rename(columns={column_name: "penality minutes"}, inplace=True)

    # SKATER STATS

    # BASIC
    elif column_name == "xGoalsPercentage":
        dataframe.rename(columns={column_name: "xGoals%"}, inplace=True)
    elif column_name == "corsiPercentage":
        dataframe.rename(columns={column_name: "corsi%"}, inplace=True)
    elif column_name == "fenwickPercentage":
        dataframe.rename(columns={column_name: "fenwick%"}, inplace=True)
    elif column_name == "xGoalsFor":
        dataframe.rename(columns={column_name: "xGoals for"}, inplace=True)
    elif column_name == "shotsOnGoalFor":
        dataframe.rename(columns={column_name: "shots"}, inplace=True)
    elif column_name == "shotAttemptsFor":
        dataframe.rename(columns={column_name: "shot attempts"}, inplace=True)
    elif column_name == "goalsFor":
        dataframe.rename(columns={column_name: "goals"}, inplace=True)
    elif column_name == "penaltiesFor":
        dataframe.rename(columns={column_name: "penalties"}, inplace=True)
    elif column_name == "penalityMinutesFor":
        dataframe.rename(columns={column_name: "penalty mins"}, inplace=True)
    elif column_name == "hitsFor":
        dataframe.rename(columns={column_name: "hits"}, inplace=True)
    elif column_name == "takeawaysFor":
        dataframe.rename(columns={column_name: "takeaways"}, inplace=True)
    elif column_name == "xGoalsAgainst":
        dataframe.rename(columns={column_name: "xGoals against"}, inplace=True)
    elif column_name == "penaltiesAgainst":
        dataframe.rename(columns={column_name: "drawn penalties"}, inplace=True)

    # OFFENSE
    elif column_name == "xOnGoalFor":
        dataframe.rename(columns={column_name: "xShots"}, inplace=True)
    elif column_name == "missedShotsFor":
        dataframe.rename(columns={column_name: "missed shots"}, inplace=True)
    elif column_name == "blockedShotAttemptsFor":
        dataframe.rename(
            columns={column_name: "shots attempts for blocked"}, inplace=True
        )
    elif column_name == "reboundsFor":
        dataframe.rename(columns={column_name: "rebounds generated"}, inplace=True)
    elif column_name == "reboundGoalsFor":
        dataframe.rename(columns={column_name: "rebound goals"}, inplace=True)
    elif column_name == "freezeFor":
        dataframe.rename(columns={column_name: "shots frozen"}, inplace=True)
    elif column_name == "mediumDangerShotsFor":
        dataframe.rename(columns={column_name: "medium danger shots"}, inplace=True)
    elif column_name == "lowDangerShotsFor":
        dataframe.rename(columns={column_name: "low danger shots"}, inplace=True)
    elif column_name == "highDangerShotsFor":
        dataframe.rename(columns={column_name: "high danger shots"}, inplace=True)
    elif column_name == "mediumDangerxGoalsFor":
        dataframe.rename(columns={column_name: "medium danger xGoals"}, inplace=True)
    elif column_name == "lowDangerxGoalsFor":
        dataframe.rename(columns={column_name: "low danger xGoals"}, inplace=True)
    elif column_name == "highDangerxGoalsFor":
        dataframe.rename(columns={column_name: "high danger xGoals"}, inplace=True)
    elif column_name == "mediumDangerGoalsFor":
        dataframe.rename(columns={column_name: "medium danger goals"}, inplace=True)
    elif column_name == "highDangerGoalsFor":
        dataframe.rename(columns={column_name: "high danger goals"}, inplace=True)
    elif column_name == "lowDangerGoalsFor":
        dataframe.rename(columns={column_name: "low danger goals"}, inplace=True)
    elif column_name == "unblockedShotAttemptsFor":
        dataframe.rename(columns={column_name: "unblocked shot attempts"}, inplace=True)
    # elif column_name == "xGoalsFromActualReboundsOfShotsFor":
    #     dataframe.rename(columns={column_name: 'xGoals from rebounds generated'}, inplace=True)
    elif column_name == "totalShotCreditFor":
        dataframe.rename(columns={column_name: "total credited shots"}, inplace=True)
    elif column_name == "savedShotsOnGoalAgainst":
        dataframe.rename(columns={column_name: "saves on shots against"}, inplace=True)

    # DEFENSE
    elif column_name == "giveawaysFor":
        dataframe.rename(columns={column_name: "giveaways"}, inplace=True)
    elif column_name == "dZoneGiveawaysFor":
        dataframe.rename(columns={column_name: "dZone giveaways"}, inplace=True)
    elif column_name == "xOnGoalAgainst":
        dataframe.rename(columns={column_name: "xShots against"}, inplace=True)
    elif column_name == "xReboundsAgainst":
        dataframe.rename(columns={column_name: "xRebounds allowed"}, inplace=True)
        dataframe.rename(columns={column_name: "shots frozen"}, inplace=True)
    elif column_name == "totalShotCreditFor":
        dataframe.rename(columns={column_name: "total credited shots"}, inplace=True)
    elif column_name == "shotsOnGoalAgainst":
        dataframe.rename(columns={column_name: "shots against"}, inplace=True)
    elif column_name == "missedShotsAgainst":
        dataframe.rename(columns={column_name: "missed shots against"}, inplace=True)
    elif column_name == "blockedShotAttemptsAgainst":
        dataframe.rename(
            columns={column_name: "shots attempts against blocked"}, inplace=True
        )
    elif column_name == "shotAttemptsAgainst":
        dataframe.rename(columns={column_name: "shots attempts against"}, inplace=True)
    elif column_name == "goalsAgainst":
        dataframe.rename(columns={column_name: "goals against"}, inplace=True)
    elif column_name == "reboundsAgainst":
        dataframe.rename(columns={column_name: "rebounds against"}, inplace=True)
    elif column_name == "reboundGoalsAgainst":
        dataframe.rename(columns={column_name: "rebound goals allowed"}, inplace=True)
    elif column_name == "freezeAgainst":
        dataframe.rename(columns={column_name: "shots against frozen"}, inplace=True)
    elif column_name == "hitsAgainst":
        dataframe.rename(columns={column_name: "hits taken"}, inplace=True)
    elif column_name == "mediumDangerShotsAgainst":
        dataframe.rename(
            columns={column_name: "medium danger shots against"}, inplace=True
        )
    elif column_name == "lowDangerShotsAgainst":
        dataframe.rename(
            columns={column_name: "low danger shots against"}, inplace=True
        )
    elif column_name == "highDangerShotsAgainst":
        dataframe.rename(
            columns={column_name: "high danger shots against"}, inplace=True
        )
    elif column_name == "mediumDangerxGoalsAgainst":
        dataframe.rename(
            columns={column_name: "medium danger xGoals against"}, inplace=True
        )
    elif column_name == "lowDangerxGoalsAgainst":
        dataframe.rename(
            columns={column_name: "low danger xGoals against"}, inplace=True
        )
    elif column_name == "highDangerxGoalsAgainst":
        dataframe.rename(
            columns={column_name: "high danger xGoals against"}, inplace=True
        )
    elif column_name == "mediumDangerGoalsAgainst":
        dataframe.rename(
            columns={column_name: "medium danger goals against"}, inplace=True
        )
    elif column_name == "highDangerGoalsAgainst":
        dataframe.rename(
            columns={column_name: "high danger goals against"}, inplace=True
        )
    elif column_name == "lowDangerGoalsAgainst":
        dataframe.rename(
            columns={column_name: "low danger goals against"}, inplace=True
        )
    elif column_name == "unblockedShotAttemptsAgainst":
        dataframe.rename(
            columns={column_name: "unblocked shot attempts against"}, inplace=True
        )
    elif column_name == "dZoneGiveawaysAgainst":
        dataframe.rename(columns={column_name: "dZone giveaways against"}, inplace=True)
    # elif column_name == "xGoalsFromActualReboundsOfShotsAgainst":
    #     dataframe.rename(columns={column_name: 'xGoals from rebounds generated'}, inplace=True)

    # EXTRA TODO:


def get_team_id(id):
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
    return teams[int(id)]
