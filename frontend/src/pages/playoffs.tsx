import React, { useEffect, useState } from "react";

import { Box, Grid, GridItem, VStack } from "@chakra-ui/react";
import axios from "axios";

import Navbar from "../components/Navbar";

const Playoffs = () => {
  const [season, setSeason] = useState<number>(20202021);
  const [playoffResult, setPlayoffResult] = useState<Playoff | undefined>();
  useEffect(() => {
    axios
      .get(
        `https://statsapi.web.nhl.com/api/v1/tournaments/playoffs?expand=round.series,schedule.game.seriesSummary&season=${season}`
      )
      .then((response) => {
        setPlayoffResult(response.data);
      });
  }, [season]);

  return (
    <Box>
      <Navbar />
      <VStack>
        {playoffResult && (
          <Grid templateRows="repeat(9, 1fr)" templateColumns="repeat(4, 1fr)">
            {/* First Column of the Grid */}

            <GridItem colSpan={1}>
              {playoffResult.rounds[0].series[0].matchupTeams[0].team.id}
              yes
            </GridItem>
            <GridItem colSpan={1}>
              {playoffResult.rounds[0].series[0].matchupTeams[0].team.id}
            </GridItem>
            <GridItem colSpan={1}>
              {playoffResult.rounds[0].series[0].matchupTeams[0].team.id}
            </GridItem>
          </Grid>
        )}
      </VStack>
    </Box>
  );
};

export interface Playoff {
  id: number;
  name: string;
  season: string;
  defaultRound: number;
  rounds: RoundElement[];
}

interface RoundElement {
  number: number;
  code: number;
  names: RoundNames;
  format: Format;
  series: Series[];
}

interface Format {
  name: string;
  description: string;
  numberOfGames: number;
  numberOfWins: number;
}

interface RoundNames {
  name: string;
  shortName: string;
}

interface Series {
  seriesNumber: number;
  seriesCode: string;
  names: SeriesNames;
  currentGame: CurrentGame;
  conference: Conference;
  round: SeriesRound;
  matchupTeams: MatchupTeam[];
}

interface Conference {
  id?: number;
  name?: string;
  link: string;
}

interface CurrentGame {
  seriesSummary: SeriesSummary;
}

interface SeriesSummary {
  gamePk: number;
  gameNumber: number;
  gameLabel: string;
  necessary: boolean;
  gameCode: number;
  gameTime: Date;
  seriesStatus: string;
  seriesStatusShort: string;
}

interface MatchupTeam {
  team: Conference;
  seed: Seed;
  seriesRecord: SeriesRecord;
}

interface Seed {
  type: string;
  rank: number;
  isTop: boolean;
}

interface SeriesRecord {
  wins: number;
  losses: number;
}

interface SeriesNames {
  matchupName: string;
  matchupShortName: string;
  teamAbbreviationA: string;
  teamAbbreviationB: string;
  seriesSlug: string;
}

interface SeriesRound {
  number: number;
}

export default Playoffs;
