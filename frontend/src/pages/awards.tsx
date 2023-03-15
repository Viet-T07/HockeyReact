import React, { useState, useEffect } from "react";

import { Box, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

const Awards = () => {
  const [trophies, setTrophies] = useState(Array<Trophy>());

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/trophy`)
      .then((response) => setTrophies(response.data.data));
  }, []);
  return (
    <Box>
      <VStack spacing={10} pt={20}>
        {trophies.map((trophy, index) => {
          return (
            <Box key={index} w="container.xl">
              <VStack spacing={5}>
                <Heading>{trophy.briefDescription}</Heading>
                {ReactHtmlParser(trophy.description)}
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Awards;
