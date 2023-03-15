import React from "react";

import { Heading, Image, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useAxios from "axios-hooks";

import TeamTabs from "../../../components/TeamTabs";
import { getTeamOptions } from "../../../constants";
import DataTable from "../../../components/DataTable";
import Dropdown from "../../../components/Dropdown";
import Loading from "../../../components/Loading";

const Team = () => {
  const router = useRouter();
  const query = router.query;
  const [{ data: franchiseData, loading: franchiseLoading }] = useAxios(
    `${process.env.NEXT_PUBLIC_URL}franchise/${query.teamId}`
  );
  const [{ data: seasonData, loading: seasonLoading }] = useAxios(
    `${process.env.NEXT_PUBLIC_URL}team/seasons/${query.teamId}`
  );
  const [{ data: teamData, loading: teamLoading }] = useAxios(
    `https://statsapi.web.nhl.com/api/v1/teams/${query.teamId}`
  );

  const getOverviewHeaders: Array<TableHeaders> = [
    {
      Header: "Season",
      accessor: (season) => (
        <Link href={`/team/season/${season.teamId}/?season=${season.seasonId}`}>
          {(season.seasonId - (season.seasonId % 10000)) / 10000 +
            "-" +
            (season.seasonId % 100 < 10 ? "0" : "") +
            (season.seasonId % 100)}
        </Link>
      ),
    },
    {
      Header: "GP",
      accessor: "gamesPlayed",
    },
    {
      Header: "W",
      accessor: "wins",
    },
    {
      Header: "L",
      accessor: "losses",
    },
    {
      Header: "OTL",
      accessor: "overtimeLosses",
    },
    {
      Header: "T",
      accessor: "ties",
    },
    {
      Header: "PTS",
      accessor: "points",
    },
    {
      Header: "League",
      accessor: (season) =>
        season.leagueSequence ? season.leagueSequence : "",
    },
    {
      Header: "Conference",
      accessor: (season) =>
        season.conferenceSequence ? season.conferenceSequence : "",
    },
    {
      Header: "Division",
      accessor: (season) =>
        season.divisionSequence ? season.divisionSequence : "",
    },
    {
      Header: "Playoffs",
      accessor: (season) => {
        if (season.decision) {
          return season.decision === "W"
            ? "* Won Stanley Cup * "
            : "Lost in " + season.seriesTitle;
        }
        return "";
      },
    },
  ];

  const getNumCups = () => {
    const teamSeasons = seasonData["data"];
    let counts = 0;
    for (let i = 0; i < teamSeasons.length; i++) {
      if (teamSeasons[i]["decision"] === "W") counts++;
    }
    return counts / 2;
  };

  const onChange = (option: { label: any; value: any }) => {
    router.push(`/team/overview/${option.value}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <div className="team-overview">
      {seasonLoading || franchiseLoading || teamLoading ? (
        <Loading />
      ) : (
        <>
          <Dropdown
            options={getTeamOptions()}
            onChange={onChange}
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
          <TeamTabs index={0} teamId={query?.teamId || ""} />
          <Heading marginTop="0.875em">Team Info</Heading>
          <div className="team-info">
            <Text fontSize="25">
              Year Founded: {teamData["teams"][0].firstYearOfPlay}
            </Text>
            <Text fontSize="25">City: {teamData["teams"][0].venue.city}</Text>
            <Text fontSize="25">Arena: {teamData["teams"][0].venue.name}</Text>
            <Text fontSize="25">
              Conference: {teamData["teams"][0].conference.name}
            </Text>
            <Text fontSize="25">
              Division: {teamData["teams"][0].division.name}
            </Text>
            <Text fontSize="25">Stanley Cups won: {getNumCups()} </Text>
          </div>

          <Heading margin="0.875em">Seasons</Heading>
          <DataTable
            headers={getOverviewHeaders}
            table={seasonData["data"].filter(
              (season: Season) => season.gameTypeId == 2
            )}
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
