import React, { useState } from "react";

import { Image, Heading, Link, Switch } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { useRouter } from "next/router";

import DataTable from "../../../components/DataTable";
import Dropdown from "../../../components/Dropdown";
import Loading from "../../../components/Loading";
import TeamTabs from "../../../components/TeamTabs";
import {
  CURRENT_SEASON,
  getTeamOptions,
  plusMinusSort,
  seasonOptions,
} from "../../../constants";

type PlayerType = "Skater" | "Goalie";

const Team = () => {
  const router = useRouter();
  const query = router.query;
  const season = Number(query.season);

  const [{ data: franchiseData, loading: franchiseLoading }] = useAxios(
    `${process.env.NEXT_PUBLIC_URL}franchise/${router.query.teamId}`
  );
  const [{ data: rosters, loading: rostersLoading }] = useAxios(
    `https://statsapi.web.nhl.com/api/v1/teams/${query.teamId}?hydrate=franchise(roster(season=${query.season},person(name,stats(splits=[statsSingleSeason]))))`
  );

  const [playerType, setPlayerType] = useState<PlayerType>("Skater");

  const filterRosters = () =>
    playerType === "Goalie"
      ? rosters["teams"][0]["franchise"]["roster"]["roster"].filter(
          (player: Player) =>
            player.position.type === "Goalie" &&
            player.person.stats[0].splits.length > 0
        )
      : rosters["teams"][0]["franchise"]["roster"]["roster"].filter(
          (player: Player) =>
            player.position.type !== "Goalie" &&
            player.person.stats[0].splits.length > 0
        );

  const rosterHeaders = (position: string): Array<TableHeaders> => {
    let headers: Array<TableHeaders> = [
      {
        Header: "Player",
        accessor: (player: Player) => (
          <div className="player-table">
            <a href={`/player/${player.person.id}`}>
              <Image
                boxSize="60px"
                src={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${player.person.id}.jpg`}
              ></Image>
            </a>
            <Link href={`/player/${player.person.id}`}>
              {player.person.fullName}
            </Link>
          </div>
        ),
        sticky: "left",
      },
      {
        Header: "Number",
        accessor: "jerseyNumber",
      },
      {
        Header: "Position",
        accessor: (player: Player) => player.position.name,
      },
      {
        Header: "Shoots",
        accessor: (player: Player) => player.person.shootsCatches,
      },
      {
        Header: "Height",
        accessor: (player: Player) => player.person.height,
      },
      {
        Header: "Weight",
        accessor: (player: Player) => player.person.weight,
      },
      {
        Header: "Born",
        accessor: (player: Player) => player.person.birthDate,
      },
      {
        Header: "Birthplace",
        accessor: (player: Player) =>
          player.person.birthCity + ", " + player.person.birthCountry,
      },
    ];

    if (position !== "Goalie") {
      headers = headers.concat([
        {
          Header: "GP",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.games
              : "",
        },
        {
          Header: "G",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.goals
              : "",
        },
        {
          Header: "A",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.assists
              : "",
        },
        {
          Header: "P",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.points
              : "",
          desc: false,
        },
        {
          Header: "+/-",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.plusMinus
              : "",
          sortType: plusMinusSort,
        },
        {
          Header: "PIM",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.penaltyMinutes
              : "",
        },
        {
          Header: "PPG",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.powerPlayGoals
              : "",
        },
        {
          Header: "PPP",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.powerPlayPoints
              : "",
        },
        {
          Header: "SHG",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.shortHandedGoals
              : "",
        },
        {
          Header: "SHP",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.shortHandedPoints
              : "",
        },
        {
          Header: "GWG",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.gameWinningGoals
              : "",
        },
        {
          Header: "OTG",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.overTimeGoals
              : "",
        },
        {
          Header: "S",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.shots
              : "",
        },
        {
          Header: "S%",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.shotPct
              : "",
        },
      ]);

      if (position === "Forward") {
        headers.push({
          Header: "FO%",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.faceOffPct
              : "",
        });
      }
    } else {
      headers = headers.concat([
        {
          Header: "GP",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.games
              : "",
        },
        {
          Header: "GS",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.gamesStarted
              : "",
        },
        {
          Header: "W",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.wins
              : "",
        },
        {
          Header: "L",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.losses
              : "",
        },
        {
          Header: "T",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.ties
              : "",
        },
        {
          Header: "OT",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.ot
              : "",
        },
        {
          Header: "SA",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.shotsAgainst
              : "",
        },
        {
          Header: "Ga",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.goalsAgainst
              : "",
        },
        {
          Header: "GAA",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? Math.round(
                  100 * data.person.stats[0].splits[0].stat.goalAgainstAverage
                ) / 100
              : "",
        },
        {
          Header: "S",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.saves
              : "",
        },
        {
          Header: "SV%",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? Math.round(
                  1000 * data.person.stats[0].splits[0].stat.savePercentage
                ) / 1000
              : "",
        },
        {
          Header: "SO",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.shutouts
              : "",
        },
        {
          Header: "MIN",
          accessor: (data) =>
            data.person.stats[0].splits.length > 0
              ? data.person.stats[0].splits[0].stat.timeOnIce
              : "",
        },
      ]);
    }
    return headers;
  };

  const seasonOnChange = (option: { label: any; value: any }) => {
    router.push(
      `/team/season/${query.teamId}/?season=${option.value}`,
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  const teamOnChange = (option: { label: any; value: any }) => {
    router.push(
      `/team/season/${option.value}/?season=${CURRENT_SEASON}`,
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  return (
    <div className="team-contract">
      {franchiseLoading || rostersLoading ? (
        <Loading />
      ) : (
        <>
          <Dropdown
            options={getTeamOptions()}
            onChange={teamOnChange}
            value={{
              label: franchiseData["data"][0].fullName,
              value: Number(query.teamId),
            }}
            marginBottom="0.875em"
          />

          <Heading as="h1" size="2xl">
            {franchiseData["data"][0].fullName}
          </Heading>
          <Image
            boxSize="250px"
            src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${query.teamId}.svg`}
          />
          <TeamTabs index={1} teamId={query?.teamId || ""} />
          <DataTable
            LeftComponent={
              <div className="d-flex justify-content-space-between align-items-end mt-2">
                <Dropdown
                  options={seasonOptions(
                    CURRENT_SEASON,
                    franchiseData["data"][0].firstSeasonId
                  )}
                  onChange={seasonOnChange}
                  value={{
                    label: `${Math.floor(Number(season) / 10000)}-${
                      Number(season) % 10000
                    }`,
                    value: season,
                  }}
                />
                <Heading>{playerType}s</Heading>
                <div>
                  Skaters
                  <Switch
                    ml="2"
                    mr="2"
                    onChange={(e) =>
                      e.target.checked
                        ? setPlayerType("Goalie")
                        : setPlayerType("Skater")
                    }
                  />
                  Goalies
                </div>
              </div>
            }
            headers={rosterHeaders(playerType)}
            table={filterRosters()}
            initialSortColumn={
              playerType === "Goalie"
                ? { id: "GP", desc: true }
                : {
                    id: "P",
                    desc: true,
                  }
            }
          />
        </>
      )}
    </div>
  );
};

export default Team;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
