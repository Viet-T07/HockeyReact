import React, { useEffect, useState } from "react";

import { Box, Image, VStack, Flex, HStack } from "@chakra-ui/react";
import axios from "axios";

import AsyncReactSelect from "../../components/AsyncReactSelect";
import ChartPopover from "../../components/ChartPopover";

const Compare = () => {
  const [player1, setPlayer1] = useState({} as Person);
  const [p1RegularStats, setP1RegularStats] = useState(Array<StatElement>());
  const [player2, setPlayer2] = useState({} as Person);
  const [p2RegularStats, setP2RegularStats] = useState(Array<StatElement>());
  const [seasons, setSeasons] = useState(Array<string>());

  useEffect(() => {
    //Filter for nhl stats
    const season = new Set<string>();

    if (p1RegularStats.length > 0) {
      p1RegularStats[0].splits.forEach((split) => {
        const curSeason = `${split.season.slice(2, 4)}-${split.season.slice(
          -2
        )}`;
        season.add(curSeason);
      });
    }

    if (p2RegularStats.length > 0) {
      p2RegularStats[0].splits.forEach((split) => {
        const curSeason = `${split.season.slice(2, 4)}-${split.season.slice(
          -2
        )}`;
        season.add(curSeason);
      });
    }
    setSeasons(Array.from(season).sort());
  }, [p1RegularStats, p2RegularStats, player1, player2]);

  const getYData = (statName: string) => {
    const stats: Array<{
      name: string;
      data: string[] | number[];
    }> = [];

    const statDisplay = statName.charAt(0).toUpperCase() + statName.slice(1);

    if (p1RegularStats.length > 0) {
      stats.push({
        name: `${player1.fullName} ${statDisplay}`,
        data: p1RegularStats[0].splits.map((split) => split.stat[statName]),
      });
    }

    if (p2RegularStats.length > 0) {
      stats.push({
        name: `${player1.fullName} ${statDisplay}`,
        data: p2RegularStats[0].splits.map((split) => split.stat[statName]),
      });
    }

    if (stats.length == 2) {
      const lengthDiff = stats[0].data.length - stats[1].data.length;

      lengthDiff > 0
        ? (stats[1].data = Array(lengthDiff).fill(null).concat(stats[1].data))
        : (stats[0].data = Array(-lengthDiff).fill(null).concat(stats[0].data));
    }

    return stats;
  };

  const onChange = (event: any) => {
    if (event) {
      axios
        .get(
          `https://statsapi.web.nhl.com/api/v1/people/${event.value}?expand=person.stats&stats=yearByYear,yearByYearPlayoffs&expand=stats.team`
        )
        .then((response) => {
          setPlayer1(response.data.people[0]);
          const player: Person = response.data.people[0];

          for (let i = 0; i < player.stats.length; i++) {
            player.stats[i].splits = player.stats[i].splits.filter(
              (split) => split.league.name === "National Hockey League"
            );
          }
          setP1RegularStats(player.stats);
        });
    } else {
      setPlayer1({} as Person);
      setP1RegularStats([]);
    }
  };

  const onChange2 = (event: any) => {
    if (event) {
      axios
        .get(
          `https://statsapi.web.nhl.com/api/v1/people/${event.value}?expand=person.stats&stats=yearByYear,yearByYearPlayoffs&expand=stats.team`
        )
        .then((response) => {
          setPlayer2(response.data.people[0]);

          const player: Person = response.data.people[0];

          for (let i = 0; i < player.stats.length; i++) {
            player.stats[i].splits = player.stats[i].splits.filter(
              (split) => split.league.name === "National Hockey League"
            );
          }

          setP2RegularStats(player.stats);
        });
    } else {
      setPlayer2({} as Person);
      setP2RegularStats([]);
    }
  };

  return (
    <Box>
      <VStack pt={20} spacing={10}>
        <Flex w="25%">
          <Image
            boxSize="60px"
            borderRadius="full"
            src={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${player1.id}.jpg`}
            fallbackSrc="https://www.clker.com/cliparts/m/3/I/C/c/2/grey-silhouette-of-man-hi.png"
            fallbackStrategy="onError"
          />
          <AsyncReactSelect
            id="player-select-1"
            onChange={onChange}
            width={"200px"}
          />
        </Flex>
        <Flex w="25%">
          <Image
            boxSize="60px"
            borderRadius="full"
            src={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${player2.id}.jpg`}
            fallbackSrc="https://www.clker.com/cliparts/m/3/I/C/c/2/grey-silhouette-of-man-hi.png"
            fallbackStrategy="onError"
          />
          <AsyncReactSelect
            id="player-select-2"
            onChange={onChange2}
            width={"200px"}
          />
        </Flex>
      </VStack>
      <VStack pt={30}>
        <HStack>
          <ChartPopover
            title="Games Played"
            xLabels={seasons}
            yLabels={getYData("games")}
          />
          <ChartPopover
            title="Goals Scored"
            xLabels={seasons}
            yLabels={getYData("goals")}
          />
        </HStack>
        <HStack>
          <ChartPopover
            title="assists"
            xLabels={seasons}
            yLabels={getYData("assists")}
          />
          <ChartPopover
            title="Points"
            xLabels={seasons}
            yLabels={getYData("points")}
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default Compare;
