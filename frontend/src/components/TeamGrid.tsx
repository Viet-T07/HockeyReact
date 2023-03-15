import React from "react";

import { Heading } from "@chakra-ui/layout";
import { Grid, GridItem } from "@chakra-ui/react";
import useAxios from "axios-hooks";

import TeamList from "../components/TeamList";
import Loading from "../components/Loading";

interface ITeamGridProps {
  useHeaders?: boolean;
  downsize?: boolean;
}

const TeamGrid = ({ useHeaders = false, downsize = false }: ITeamGridProps) => {
  const [{ data, loading }] = useAxios(
    "https://statsapi.web.nhl.com/api/v1/teams"
  );

  const getDivision = (division: DivisionName) => {
    return data.teams.filter((team: Team) => team.division?.name === division);
  };

  return (
    <div className="team-grid">
      {loading ? (
        <Loading />
      ) : (
        <>
          {useHeaders && (
            <>
              <Heading as="h1" size="2xl">
                All Teams
              </Heading>

              <Grid templateColumns="repeat(3, 1fr)">
                <Heading as="h2" size="xl">
                  Eastern Conference
                </Heading>
                <GridItem />
                <Heading as="h2" size="xl">
                  Western Conference
                </Heading>
              </Grid>

              <Heading as="h2" size="xl">
                Divisions
              </Heading>
            </>
          )}

          <Grid templateColumns="repeat(2, 1fr)">
            <GridItem>
              <Grid templateColumns="repeat(2, 1fr)">
                <GridItem>
                  <TeamList
                    title="Metropolitan"
                    division={getDivision("Metropolitan")}
                    downsize={downsize}
                  />
                </GridItem>
                <GridItem>
                  <TeamList
                    title="Atlantic"
                    division={getDivision("Atlantic")}
                    downsize={downsize}
                  />
                </GridItem>
              </Grid>
            </GridItem>

            <Grid templateColumns="repeat(2, 1fr)">
              <GridItem>
                <TeamList
                  title="Central"
                  division={getDivision("Central")}
                  downsize={downsize}
                />
              </GridItem>
              <GridItem>
                <TeamList
                  title="Pacific"
                  division={getDivision("Pacific")}
                  downsize={downsize}
                />
              </GridItem>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default TeamGrid;
