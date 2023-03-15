import React, { useEffect, useState } from "react";

import { Checkbox } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { useRouter } from "next/router";

import SearchBox from "../../components/SearchBox";
import PlayerList from "../../components/PlayerList";

const Search = () => {
  const { query } = useRouter();
  const [checked, setChecked] = useState(true);
  const [playerName, setPlayerName] = useState([]);
  const [{}, get] = useAxios({}, { manual: true, useCache: false });

  useEffect(() => {
    const search = query?.name ? query.name.trim() : "";
    get({
      url: `https://suggest.svc.nhl.com/svc/suggest/v1/${
        checked ? "minactiveplayers/" : "minplayers/"
      }${search.trim()}/30`,
    }).then((response) => {
      setPlayerName(response.data["suggestions"]);
    });
  }, [query.name, checked, get]);

  return (
    <div>
      <div className="playerSearchContainer">
        <div className="playerSearchBox">
          <SearchBox mr />
          <Checkbox
            colorScheme="blue"
            defaultChecked
            onChange={(event) => setChecked(event.target.checked)}
          >
            Active Players Only
          </Checkbox>
        </div>
        <PlayerList playerName={playerName} />
      </div>
    </div>
  );
};

export default Search;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
