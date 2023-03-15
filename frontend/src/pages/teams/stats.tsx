import React, { useState } from "react";

import useAxios from "axios-hooks";
import { Heading, Link, Image } from "@chakra-ui/react";

import Dropdown from "../../components/Dropdown";
import {
  seasonOptions,
  CURRENT_SEASON,
  FIRST_ADVANCED_DATA_SEASON,
  situationOptions,
} from "../../constants";
import DataTable from "../../components/DataTable";
import Loading from "../../components/Loading";

const Stats = () => {
  const [season, setSeason] = useState(20202021);
  const [situtation, setSituation] = useState<Situations>("all");
  const [{ data, loading }] = useAxios(
    `${process.env.NEXT_PUBLIC_URL}teams/?season=${Math.floor(
      season / 10000
    )}&situation=${situtation}`
  );

  const getColumns = () => {
    const columns = Object.keys(data.stats[0]).map((header) => {
      const column: any = {
        Header: header,
        accessor: header,
      };
      if (header === "season") {
        column["Cell"] = (cell: any) => {
          const value = cell.value;
          return `${value}-${cell.value + 1}`;
        };
      } else if (header === "teamId") {
        column["Header"] = "Team";
        column["Cell"] = (cell: any) => {
          return (
            <Link href={`/team/overview/${cell.value}`}>
              <Image
                p={2}
                src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${cell.value}.svg`}
              />
            </Link>
          );
        };
        column["sticky"] = "left";
        column["disableSortBy"] = true;
      }
      return column;
    });
    return [columns.pop(), ...columns];
  };

  return (
    <div className="d-flex flex-column align-center justify-content-center">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Heading>TEAM STATS</Heading>
          <DataTable
            LeftComponent={
              <div className="d-flex">
                <Dropdown
                  options={seasonOptions(
                    CURRENT_SEASON,
                    FIRST_ADVANCED_DATA_SEASON
                  )}
                  onChange={(option: SelectOption) => setSeason(option.value)}
                  value={{
                    label: `${Math.floor(season / 10000)}-${season % 10000}`,
                    value: season,
                  }}
                  marginRight="0.875em"
                  label="Seasons"
                />
                <Dropdown
                  options={situationOptions()}
                  onChange={(option: SelectOption) =>
                    setSituation(option.value)
                  }
                  value={{
                    label: situtation,
                    value: situtation,
                  }}
                  label="Situation"
                />
              </div>
            }
            headers={getColumns()}
            table={data.stats}
            initialSortColumn={{ id: "name", desc: false }}
          />
        </>
      )}
    </div>
  );
};

export default Stats;
