import React from "react";

import useAxios from "axios-hooks";
import { useRouter } from "next/router";

import DataTable from "../../../components/DataTable";
import Dropdown from "../../../components/Dropdown";
import Loading from "../../../components/Loading";
import StandingTabs from "../../../components/StandingTabs";
import {
  getStandingHeaders,
  CURRENT_SEASON,
  FIRST_SEASON,
  seasonOptions,
} from "../../../constants";

const DivisionStandings = () => {
  const router = useRouter();

  const season = router.query.year || "";

  const [{ data, loading }] = useAxios({
    url: `https://statsapi.web.nhl.com/api/v1/standings?hydrate=record(overall),division,conference,team()&season=${season}`,
  });

  const onChange = (option: { label: string; value: string }) => {
    router.push(`/standings/division/${option.value}`);
  };

  return (
    <div className="division-standings">
      {loading ? (
        <Loading />
      ) : (
        <>
          <StandingTabs index={0} year={season} />
          <Dropdown
            onChange={onChange}
            options={seasonOptions(CURRENT_SEASON, FIRST_SEASON)}
            value={{
              label: `${Math.floor(Number(season) / 10000)}-${
                Number(season) % 10000
              }`,
              value: season,
            }}
            marginTop="0.875em"
            marginBottom="0.875em"
          />
          {data["records"].map((division: any, index: number) => {
            return (
              <DataTable
                headers={getStandingHeaders(division.division.name)}
                table={division["teamRecords"]}
                key={index}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default DivisionStandings;

export async function getServerSideProps(context: any) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
