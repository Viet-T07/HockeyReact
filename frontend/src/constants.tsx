/* eslint-disable unused-imports/no-unused-vars */
import React from "react";

import { Image, Center, LinkOverlay, Stack } from "@chakra-ui/react";

export const CURRENT_SEASON = 20212022;
export const FIRST_ADVANCED_DATA_SEASON = 20082009;
export const FIRST_SEASON = 19171918;

export enum CurrentTeamLink {
  APIV1Conferences5 = "/api/v1/conferences/5",
  APIV1League133 = "/api/v1/league/133",
  APIV1LeagueNull = "/api/v1/league/null",
  APIV1Teams21 = "/api/v1/teams/21",
}

export enum TeamLink {
  APIV1Teams21 = "/api/v1/teams/21",
  APIV1TeamsNull = "/api/v1/teams/null",
}

export const contractMoneySort = (
  rowA: any,
  rowB: any,
  columnId: any,
  desc: any
) => {
  const a = rowA.values[columnId];
  const b = rowB.values[columnId];
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }

  return 0;
};

export const plusMinusSort = (
  rowA: any,
  rowB: any,
  columnId: any,
  desc: any
) => {
  const a = Number(rowA.values[columnId]);
  const b = Number(rowB.values[columnId]);
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
};

export const seasonOptions = (firstYear: number, lastYear: number) => {
  const season: Array<{ label: string; value: number }> = [];
  for (let i = firstYear; i >= lastYear; i -= 10001) {
    season.push({ label: `${Math.floor(i / 10000)}-${i % 10000}`, value: i });
  }
  return season;
};

export const situationOptions = (): Array<SelectOption> => {
  return [
    { label: "all", value: "all" },
    { label: "other", value: "other" },
    { label: "5on5", value: "5on5" },
    { label: "5on4", value: "5on4" },
    { label: "4on5", value: "4on5" },
  ];
};

export const getStandingHeaders = (
  firstColumn: string
): Array<TableHeaders> => [
  {
    Header: firstColumn,
    accessor: (data) => (
      <LinkOverlay href={`/team/overview/${data.team.id}`}>
        <Stack direction="column">
          <Center>
            <Image
              boxSize="50px"
              // p={3}
              src={
                "https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/" +
                data.team.id +
                ".svg"
              }
            />
          </Center>
          <Center>{data.team.name}</Center>
        </Stack>
      </LinkOverlay>
    ),
    sticky: "left",
  },
  {
    Header: "GP",
    accessor: "gamesPlayed",
  },
  {
    Header: "Wins",
    accessor: (data) => data.leagueRecord.wins,
  },
  {
    Header: "Losses",
    accessor: (data) => data.leagueRecord.losses,
  },
  {
    Header: "Ot",
    accessor: (data) => data.leagueRecord.ot,
  },
  {
    Header: "Points",
    accessor: "points",
  },
  {
    Header: "P%",
    accessor: (data) => Math.round(data.pointsPercentage * 100) / 100,
  },
  {
    Header: "Rw",
    accessor: "regulationWins",
  },
  {
    Header: "Row",
    accessor: "row",
  },
  {
    Header: "GF",
    accessor: "goalsScored",
  },
  {
    Header: "GA",
    accessor: "goalsAgainst",
  },
  {
    Header: "Diff",
    accessor: (data) => {
      return data.goalsScored - data.goalsAgainst;
    },
  },
  {
    Header: "Home",
    accessor: (data) => {
      const homeRecord = data.records.overallRecords[0];
      return `${homeRecord.wins}-${homeRecord.losses}-${homeRecord.ot}`;
    },
  },
  {
    Header: "Away",
    accessor: (data) => {
      const awayRecord = data.records.overallRecords[1];
      return `${awayRecord.wins}-${awayRecord.losses}-${awayRecord.ot}`;
    },
  },
  {
    Header: "S/o",
    accessor: (data) => {
      const shootoutRecord = data.records.overallRecords[2];
      return `${shootoutRecord.wins}-${shootoutRecord.losses}`;
    },
  },
  {
    Header: "L10",
    accessor: (data) => {
      const lastTenRecord = data.records.overallRecords[3];
      return `${lastTenRecord.wins}-${lastTenRecord.losses}-${lastTenRecord.ot}`;
    },
  },
  {
    Header: "Streak",
    accessor: (data) => data.streak.streakCode,
  },
];

export const getPlayerHeaders = (position: string): Array<TableHeaders> => {
  let headers: Array<TableHeaders> = [];
  if (position !== "Goalie") {
    headers = [
      {
        Header: "Season",
        accessor: (data) => {
          if (data.season === "Total") {
            return data.season;
          }
          return `${data.season.slice(0, 4)}-${data.season.slice(-2)}`;
        },
      },
      {
        Header: "Team",
        accessor: (data) => data.team.name,
      },
      {
        Header: "GP",
        accessor: (data) => data.stat.games,
      },
      {
        Header: "G",
        accessor: (data) => data.stat.goals,
      },
      {
        Header: "A",
        accessor: (data) => data.stat.assists,
      },
      {
        Header: "P",
        accessor: (data) => data.stat.points,
      },
      {
        Header: "+/-",
        accessor: (data) => data.stat.plusMinus,
      },
      {
        Header: "PIM",
        accessor: (data) => data.stat.penaltyMinutes,
      },
      {
        Header: "PPG",
        accessor: (data) => data.stat.powerPlayGoals,
      },
      {
        Header: "PPP",
        accessor: (data) => data.stat.powerPlayPoints,
      },
      {
        Header: "SHG",
        accessor: (data) => data.stat.shortHandedGoals,
      },
      {
        Header: "SHP",
        accessor: (data) => data.stat.shortHandedPoints,
      },
      {
        Header: "GWG",
        accessor: (data) => data.stat.gameWinningGoals,
      },
      {
        Header: "OTG",
        accessor: (data) => data.stat.overTimeGoals,
      },
      {
        Header: "S",
        accessor: (data) => data.stat.shots,
      },
      {
        Header: "S%",
        accessor: (data) => data.stat.shotPct,
      },
    ];

    if (position === "Forward") {
      headers.push({
        Header: "FO%",
        accessor: (data) => data.stat.faceOffPct,
      });
    }
  } else {
    headers = [
      {
        Header: "Season",
        accessor: (data) => {
          if (data.season === "Total") {
            return data.season;
          }
          return `${data.season.slice(0, 4)}-${data.season.slice(-2)}`;
        },
      },
      {
        Header: "Team",
        accessor: (data) => data.team.name,
      },
      {
        Header: "GP",
        accessor: (data) => data.stat.games,
      },
      {
        Header: "GS",
        accessor: (data) => data.stat.gamesStarted,
      },
      {
        Header: "W",
        accessor: (data) => data.stat.wins,
      },
      {
        Header: "L",
        accessor: (data) => data.stat.losses,
      },
      {
        Header: "T",
        accessor: (data) => data.stat.ties,
      },
      {
        Header: "OT",
        accessor: (data) => data.stat.ot,
      },
      {
        Header: "SA",
        accessor: (data) => data.stat.shotsAgainst,
      },
      {
        Header: "Ga",
        accessor: (data) => data.stat.goalsAgainst,
      },
      {
        Header: "GAA",
        accessor: (data) =>
          Math.round(100 * data.stat.goalAgainstAverage) / 100,
      },
      {
        Header: "S",
        accessor: (data) => data.stat.saves,
      },
      {
        Header: "SV%",
        accessor: (data) => Math.round(1000 * data.stat.savePercentage) / 1000,
      },
      {
        Header: "SO",
        accessor: (data) => data.stat.shutouts,
      },
      {
        Header: "MIN",
        accessor: (data) => data.stat.timeOnIce,
      },
    ];
  }

  return headers;
};

export const getTeamOptions = () => {
  const option: any = [];
  let k: keyof typeof teams;
  for (k in teams) {
    option.push({ label: k, value: teams[k] });
  }
  option.sort((a: any, b: any) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
  return option;
};

export const teams = {
  "New Jersey Devils": 1,
  "New York Islanders": 2,
  "New York Rangers": 3,
  "Philadelphia Flyers": 4,
  "Pittsburgh Penguins": 5,
  "Boston Bruins": 6,
  "Buffalo Sabres": 7,
  "Montréal Canadiens": 8,
  "Ottawa Senators": 9,
  "Toronto Maple Leafs": 10,
  "Carolina Hurricanes": 12,
  "Florida Panthers": 13,
  "Tampa Bay Lightning": 14,
  "Washington Capitals": 15,
  "Chicago Blackhawks": 16,
  "Detroit Red Wings": 17,
  "Nashville Predators": 18,
  "St. Louis Blues": 19,
  "Calgary Flames": 20,
  "Colorado Avalanche": 21,
  "Edmonton Oilers": 22,
  "Vancouver Canucks": 23,
  "Anaheim Ducks": 24,
  "Dallas Stars": 25,
  "Los Angeles Kings": 26,
  "San Jose Sharks": 28,
  "Columbus Blue Jackets": 29,
  "Minnesota Wild": 30,
  "Winnipeg Jets": 52,
  "Arizona Coyotes": 53,
  "Vegas Golden Knights:": 54,
  "Seattle Kraken": 55,
};

// HARDCODED
// [PRIMARY COLOR HEX, SECONDARY COLOR HEX, PRIMARY COLOR, SECONDARY COLOR, WHETHER TO ONLY USE PRIMARY OR EITHER]
export const colorScheme = {
  1: ["#CE1126", "#000000", "RED", "BLACK", "EITHER"], // New Jersey Devils
  2: ["#00539B", "#F47D30", "BLUE", "ORANGE", "EITHER"], // New York Islanders
  3: ["#0038A8", "#CE1126", "BLUE", "RED", ""], // New York Rangers
  4: ["#F74902", "#000000", "ORANGE", "BLACK", ""], // Philadelphia Flyers
  5: ["#FCB514", "#CFC493", "YELLOW", "GOLD", "EITHER"], // Pittsburgh Penguins
  6: ["#FFB81C", "#000000", "YELLOW", "BLACK", ""], // Boston Bruins
  7: ["#002654", "#FCB514", "BLUE", "YELLOW", "EITHER"], // Buffalo Sabres
  8: ["#AF1E2D", "#192168", "RED", "BLUE", "EITHER"], // Montréal Canadiens
  9: ["#C52032", "#C2912C", "RED", "GOLD", "EITHER"], // Ottawa Senators
  10: ["#00205B", "#FFFFFF", "BLUE", "WHITE", ""], // Toronto Maple Leafs
  12: ["#CC0000", "#000000", "RED", "BLACK", "EITHER"], // Carolina Hurricanes
  13: ["#C8102E", "#B9975B", "RED", "GOLD", ""], // Florida Panthers
  14: ["#002868", "#FFFFFF", "BLUE", "WHITE", ""], // Tampa Bay Lightning
  15: ["#C8102E", "#041E42", "RED", "BLUE", "EITHER"], // Washington Capitals
  16: ["#CF0A2C", "#000000", "RED", "BLACK", ""], // Chicago Blackhawks
  17: ["#CE1126", "#FFFFFF", "RED", "WHITE", ""], // Detroit Red Wings
  18: ["#FFB81C", "#041E42", "YELLOW", "BLUE", ""], // Nashville Predators
  19: ["#002F87", "#FCB514", "BLUE", "YELLOW", ""], // St. Louis Blues
  20: ["#C8102E", "#F1BE48", "RED", "YELLOW", "EITHER"], // Calgary Flames
  21: ["#6F263D", "#236192", "RED", "BLUE", "EITHER"], // Colorado Avalanche
  22: ["#FF4C00", "#041E42", "ORANGE", "BLUE", "EITHER"], // Edmonton Oilers
  23: ["#00205B", "#00843D", "BLUE", "GREEN", "EITHER"], // Vancouver Canucks
  24: ["#B9975B", "#F47A38", "GOLD", "ORANGE", "EITHER"], // Anaheim Ducks
  25: ["#006847", "#8F8F8C", "GREEN", "GRAY", ""], // Dallas Stars
  26: ["#111111", "#A2AAAD", "BLACK", "GRAY", ""], // Los Angeles Kings
  28: ["#006D75", "#000000", "BLUE", "BLACK", ""], // San Jose Sharks
  29: ["#002654", "#CE1126", "BLUE", "RED", "EITHER"], // Columbus Blue Jackets
  30: ["#154734", "#A6192E", "GREEN", "RED", "EITHER"], // Minnesota Wild
  52: ["#041E42", "#AC162C", "BLUE", "RED", ""], // Winnipeg Jets
  53: ["#8C2633", "#5F259F", "RED", "PURPLE", "EITHER"], // Arizona Coyotes
  54: ["#B4975A", "#333F42", "GOLD", "GRAY", "EITHER"], // Vegas Golden Knights
  55: ["#99D9D9", "#001628", "BLUE", "BLACK", "EITHER"], // Seattle Kraken
};

export interface Trophy {
  id: number;
  briefDescription: string;
  categoryId: number;
  createdOn: Date;
  description: string;
  footnote: null;
  homePageUrl: string;
  imageUrl: string;
  name: string;
  shortName: string;
}
