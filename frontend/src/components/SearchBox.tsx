import React, { useState } from "react";

import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface ISearchBoxProps {
  show?: boolean;
  mr?: boolean;
}

export default function SearchBox({ show = true, mr }: ISearchBoxProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleText = (event: any) => {
    setQuery(event.target.value);
  };

  const handleClick = (event: any) => {
    event.preventDefault();
    router.push(`/player/search/?name=${query}`);
  };

  return show ? (
    <form onSubmit={handleClick} className={`${mr ? "mr-2" : ""}`}>
      <InputGroup>
        <Input
          onChange={handleText}
          placeholder={query ? query : "Find a Player"}
        />
        <InputRightElement width="4.5rem">
          <Button
            type="submit"
            bg={"gray.600"}
            color={"white"}
            _hover={{
              bg: "gray.700",
            }}
            height="2.4rem"
          >
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  ) : (
    <></>
  );
}
