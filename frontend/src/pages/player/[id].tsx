import React, { useRef, useState } from "react";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Container,
  Heading,
  Image,
  Link,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useAxios from "axios-hooks";
import { useMount } from "react-use";
import dynamic from "next/dynamic";

import DataTable from "../../components/DataTable";
import { getPlayerHeaders } from "../../constants";
import Dropdown from "../../components/Dropdown";
import Loading from "../../components/Loading";
import { charts, getChartOptions } from "../../charts";

type Stats = "Regular Stats" | "Advanced Stats";

const Player = () => {
  const { query } = useRouter();
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
  const seasons = useRef(Array<string>());
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartData, setChartData] = useState<any>();
  const [seasonType, setSeasonType] = useState("Regular Season");
  const [statType, setStatType] = useState<Stats>("Regular Stats");
  const [advancedStatType, setAdvancedStatType] = useState({
    label: "Basic Advanced Stats",
    value: "base",
  });
  const [{ data: nhlData, loading: nhlLoading, error: nhlError }, getNhlData] =
    useAxios(
      {
        url: `https://statsapi.web.nhl.com/api/v1/people/${query.id}?expand=person.stats&stats=yearByYear,yearByYearPlayoffs,careerRegularSeason,careerPlayoffs&expand=stats.team`,
      },
      { manual: true }
    );
  const [
    { data: playerData, loading: playerLoading, error: playerError },
    getPlayer,
  ] = useAxios(
    { baseURL: `${process.env.NEXT_PUBLIC_URL}player` },
    { manual: true }
  );

  const getNhlStats = () => {
    const playerInfo = nhlData.people[0];
    if (seasonType === "Post Season") {
      const playoffStats = playerInfo.stats[1].splits.filter(
        (split: Split) => split.league.name === "National Hockey League"
      );

      if (playoffStats.length === 0) {
        return playoffStats;
      }

      const total = playerInfo.stats[3].splits[0];
      total.season = "Total";
      total.team = {
        name: "",
      };
      playoffStats.push(total);

      return playoffStats;
    }

    const regularStats = playerInfo.stats[0].splits.filter(
      (split: Split) => split.league.name === "National Hockey League"
    );

    if (regularStats.length === 0) {
      return regularStats;
    }
    const total = playerInfo.stats[2].splits[0];
    total.season = "Total";
    total.team = {
      name: "",
    };
    regularStats.push(total);

    return regularStats;
  };

  useMount(() => {
    getNhlData().then((response) => {
      const data = {
        name: response.data["people"][0].fullName,
        id: Number(query.id),
        position: response.data["people"][0].primaryPosition.type,
      };

      getPlayer({
        url: `?name=${data.name}&id=${data.id}&position=${data.position}`,
      }).then((response) => {
        if (response.data.base !== undefined) {
          //Player Position
          const baseChart =
            data.position !== "Goalie" ? charts.player : charts.goalie;

          //Seasons with advanced stats
          seasons.current = response.data.base.map(
            (year: any) =>
              `${year.season}-${(year.season + 1).toString().slice(-2)}`
          );
          setChartData({
            info: baseChart[0],
            data: getChartOptions(
              seasons.current,
              baseChart[0],
              response.data,
              chartType
            ),
          });
        }
      });
    });
  });

  const Contracts = () => {
    return (
      <DataTable
        headers={Object.keys(playerData.contracts[0]).map((header, index) => {
          const column: any = {
            Header: header,
            id: `${header}${index}`,
            accessor: header,
          };

          if (!(header === "CLAUSE" || header === "SEASON")) {
            column["Cell"] = (cell: any) => {
              if (cell.value === -1) {
                return "ENTRY-LEVEL SLIDE";
              }
              return cell.value.toLocaleString();
            };
          }
          return column;
        })}
        table={playerData.contracts}
      />
    );
  };

  const PlayerHeader = () => {
    const playerInfo = nhlData.people[0];
    return (
      <>
        <Heading>
          {playerInfo.fullName} #{playerInfo.primaryNumber}
        </Heading>
        <div className="playerHeader">
          {playerInfo.primaryPosition.code} | {playerInfo.height} |{" "}
          {playerInfo.weight}|{" "}
          {playerInfo.currentTeam && (
            <Link
              href={`/team/overview/${playerInfo.currentTeam.id}`}
              className="playerTeamInfo"
            >
              <Image
                src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${playerInfo.currentTeam.id}.svg`}
              />
              {playerInfo.currentTeam.name}
            </Link>
          )}
        </div>
      </>
    );
  };

  const StatsTable = () => {
    const playerInfo = nhlData.people[0];
    const playerPosition = playerInfo.primaryPosition.type;

    const getAdvancedStatsHeaders = () => {
      return Object.keys(playerData[advancedStatType.value][0]).map(
        (header) => {
          return {
            Header: header,
            accessor:
              header === "season"
                ? (data: any) => {
                    return `${data.season}-${(data.season + 1)
                      .toString()
                      .slice(-2)}`;
                  }
                : header,
          };
        }
      );
    };

    const advancedStatsOptions =
      playerPosition === "Goalie"
        ? [{ label: "Base Advanced Stats", value: "base" }]
        : [
            { label: "Basic Advanced Stats", value: "base" },
            { label: "Offensive Advanced Stats", value: "offense" },
            { label: "Defensive Advanced Stats", value: "defense" },
          ];

    const statOptions = [{ label: "Regular Stats", value: "Regular Stats" }];
    if (playerData.base) {
      statOptions.push({ label: "Advanced Stats", value: "Advanced Stats" });
    }

    return (
      <DataTable
        LeftComponent={
          <div className="d-flex mb-2">
            <Dropdown
              options={statOptions}
              onChange={(option: SelectOption) => {
                setStatType(option.value);
              }}
              value={{ label: statType, value: statType }}
              width="15em"
              marginRight="0.875em"
            />
            {statType === "Regular Stats" ? (
              <Dropdown
                options={[
                  { label: "Regular Season", value: "Regular Season" },
                  { label: "Post Season", value: "Post Season" },
                ]}
                onChange={(option: SelectOption) => {
                  setSeasonType(option.value);
                }}
                value={{ label: seasonType, value: seasonType }}
                width="15em"
              />
            ) : (
              <Dropdown
                options={advancedStatsOptions}
                onChange={(option: SelectOption) => {
                  setAdvancedStatType(option);
                }}
                value={advancedStatType}
                width="15em"
              />
            )}
          </div>
        }
        headers={
          statType === "Regular Stats"
            ? getPlayerHeaders(playerPosition)
            : getAdvancedStatsHeaders()
        }
        table={
          statType === "Regular Stats"
            ? getNhlStats()
            : playerData[advancedStatType.value]
        }
      />
    );
  };

  const StatsChart = () => {
    const playerStats =
      nhlData.people[0].primaryPosition.type !== "Goalie"
        ? charts.player
        : charts.goalie;

    return !playerData.base || !chartData ? (
      <></>
    ) : (
      <div>
        <div className="d-flex">
          <Dropdown
            options={playerStats.map((stat) => {
              return { label: stat.title, value: stat };
            })}
            isSearchable={false}
            value={{ label: chartData.info.title, value: chartData.info }}
            onChange={(option: SelectOption) => {
              setChartData({
                info: option.value,
                data: getChartOptions(
                  seasons.current,
                  option.value,
                  playerData,
                  chartType
                ),
              });
            }}
            width="200px"
            marginRight="0.875em"
          />
          <Dropdown
            options={[
              { label: "Bar", value: "bar" },
              { label: "Line", value: "line" },
            ]}
            isSearchable={false}
            value={{
              label: chartType[0].toUpperCase() + chartType.substring(1),
              value: chartType,
            }}
            onChange={(option: SelectOption) => setChartType(option.value)}
            width="200px"
          />
        </div>
        <Chart
          options={chartData.data.options}
          series={chartData.data.series}
          type={chartType}
        />
      </div>
    );
  };

  const Error = () => {
    return (
      <Box>
        <Container pt={40}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>
              No player with id {query.id} was found
            </AlertTitle>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        </Container>
      </Box>
    );
  };

  return (
    <div className="align-center">
      {nhlLoading || playerLoading || !nhlData ? (
        <Loading />
      ) : nhlError || playerError ? (
        <Error />
      ) : (
        <>
          <div className="playerImage ">
            <Image
              rounded="xl"
              objectFit="contain"
              src={`https://cms.nhl.bamgrid.com/images/actionshots/${query.id}.jpg`}
              fallbackSrc={`http://nhl.bamcontent.com/images/headshots/current/168x168/${query.id}.jpg`}
              fallbackStrategy="onError"
            />
          </div>
          <div className="playerPage">
            <PlayerHeader />
            <Tabs variant="line" isFitted width="70%">
              <TabList>
                <Tab
                  border="2px"
                  _selected={{
                    border: "4px",
                    bg: "purple.700",
                    borderColor: "purple.700",
                  }}
                >
                  Contracts
                </Tab>
                <Tab
                  border="2px"
                  _selected={{
                    border: "4px",
                    bg: "purple.700",
                    borderColor: "purple.700",
                  }}
                >
                  Stats
                </Tab>
                <Tab
                  border="2px"
                  _selected={{
                    border: "4px",
                    bg: "purple.700",
                    borderColor: "purple.700",
                  }}
                >
                  Charts
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Contracts />
                </TabPanel>
                <TabPanel>
                  <StatsTable />
                </TabPanel>
                <TabPanel>
                  <StatsChart />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default Player;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
