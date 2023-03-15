import React from "react";

import useAxios from "axios-hooks";
import { useRouter } from "next/router";

import DataTable from "../../../components/DataTable";
import StandingTabs from "../../../components/StandingTabs";
import {
  getStandingHeaders,
  seasonOptions,
  FIRST_SEASON,
  CURRENT_SEASON,
} from "../../../constants";
import Loading from "../../../components/Loading";
import Dropdown from "../../../components/Dropdown";

const DivisionStandings = () => {
  const router = useRouter();
  const season = router.query.year || "";

  const [{ data, loading }] = useAxios({
    url: `https://statsapi.web.nhl.com/api/v1/standings/byLeague/?season=${season}&expand=standings.record`,
  });

  const onChange = (option: { label: any; value: any }) =>
    router.push(`/standings/league/${option.value}`);

  return (
    <div className="league-standings">
      {loading ? (
        <Loading />
      ) : (
        <>
          <StandingTabs index={1} year={season} />
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
          {data["records"].map((value: any, index: number) => {
            return (
              <DataTable
                headers={getStandingHeaders("National Hockey League")}
                table={value["teamRecords"]}
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
