import React from "react";

import { Heading, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useAxios from "axios-hooks";

import DataTable from "../../../components/DataTable";
import TeamTabs from "../../../components/TeamTabs";
import { getTeamOptions } from "../../../constants";
import Loading from "../../../components/Loading";
import Dropdown from "../../../components/Dropdown";

interface FranchiseInfo {
  name: string;
  contracts: any;
}

const Team = () => {
  const router = useRouter();
  const [{ data: contractData, loading: contractLoading }] =
    useAxios<FranchiseInfo>(
      `${process.env.NEXT_PUBLIC_URL}team/contracts/${router.query.teamId}`
    );
  const onChange = (option: { label: any; value: any }) => {
    router.push(`/team/contracts/${option.value}`, undefined, {
      scroll: false,
    });
  };

  return (
    <div className="team-contract">
      {contractLoading || !contractData ? (
        <Loading />
      ) : (
        <>
          <Dropdown
            options={getTeamOptions()}
            onChange={onChange}
            value={{
              label: contractData.name,
              value: Number(router.query.teamId),
            }}
            isSearchable={true}
          />
          <Heading as="h1" size="2xl">
            {contractData.name}
          </Heading>
          <Image
            boxSize="250px"
            src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${router.query.teamId}.svg`}
          />
          <TeamTabs index={2} teamId={router.query?.teamId || ""} />
          <Heading as="h1">Team Contracts</Heading>
          {Object.values(contractData["contracts"]).map(
            (frame: any, index: number) => {
              return (
                <div className="mt-4" key={`teamcontract${index}`}>
                  <DataTable
                    headers={Object.keys(frame[0]).map((header, index) => {
                      const column: any = {
                        Header: header,
                        accessor: header,
                        sticky: index === 0 ? "left" : "",
                      };
                      if (header.match(/\d{4}-\d{2}/g)) {
                        column["Cell"] = (cell: any) => {
                          if (cell.value === 0) {
                            return "-";
                          }
                          return cell.value.toLocaleString();
                        };
                      }

                      return column;
                    })}
                    table={frame}
                    key={index}
                  />
                </div>
              );
            }
          )}
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
