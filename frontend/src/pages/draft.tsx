import React, { useState } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Heading, IconButton, Link } from "@chakra-ui/react";
import useAxios from "axios-hooks";

import DataTable from "../components/DataTable";
import Dropdown from "../components/Dropdown";
import Loading from "../components/Loading";
import { CURRENT_SEASON, FIRST_SEASON, seasonOptions } from "../constants";

const Draft = () => {
  const [season, setSeason] = useState(Math.floor(CURRENT_SEASON / 10000));
  const [{ data, loading }] = useAxios(
    `${process.env.NEXT_PUBLIC_URL}draft/${season}`
  );
  const [round, setRound] = useState(1);

  const onChange = (option: { label: any; value: any }) => {
    setSeason(option.value);
    setRound(1);
  };

  const columns: Array<TableHeaders> = [
    {
      Header: "Player",
      accessor: (data) => (
        <Link href={`player/${data.playerId}`}>{data.playerName}</Link>
      ),
    },
    { Header: "Position", accessor: (data) => data.position },
    { Header: "Round", accessor: (data) => data.roundNumber },
    { Header: "Pick", accessor: (data) => data.pickInRound },
    { Header: "Drafted By", accessor: (data) => data.triCode },
    {
      Header: "Drafted From",
      accessor: (data) => (
        <a>
          {data.amateurClubName} [{data.amateurLeague}]
        </a>
      ),
    },
  ];

  const Stepper = () => {
    const numberOfRounds = Object.values(data).length;
    const decrement = () => {
      if (round - 1 > 0) {
        setRound(round - 1);
      }
    };
    const increment = () => {
      if (round + 1 <= numberOfRounds) {
        setRound(round + 1);
      }
    };
    return (
      <div>
        <IconButton
          variant="ghost"
          onClick={decrement}
          aria-label="Arrow Left"
          icon={<ArrowLeftIcon />}
        />
        Round {round}
        <IconButton
          variant="ghost"
          onClick={increment}
          aria-label="Arrow Right"
          icon={<ArrowRightIcon />}
        />
      </div>
    );
  };

  return (
    <div className="d-flex flex-column align-center">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Heading>Drafts</Heading>
          <DataTable
            LeftComponent={
              <div className="d-flex justify-content-space-between">
                <Dropdown
                  options={seasonOptions(CURRENT_SEASON, FIRST_SEASON).map(
                    (season) => {
                      const singleYear = Math.floor(season.value / 10000);
                      return { label: singleYear, value: singleYear };
                    }
                  )}
                  onChange={onChange}
                  value={{ label: season, value: season }}
                  width="10vw"
                />
                <Stepper />
              </div>
            }
            headers={columns}
            table={data[`Round${round}`]}
          />
        </>
      )}
    </div>
  );
};

export default Draft;
