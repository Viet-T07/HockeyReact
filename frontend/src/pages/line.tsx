import React, { useEffect, useState } from "react";

import {
  Container,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

import DataTable from "../components/DataTable";
import SearchForm from "../components/SearchForm";

const Line = () => {
  const [frames, setFrames] = useState<any>([]);
  const [numLine, setNumLines] = useState(10);
  const [name, setName] = useState("");

  const url = process.env.NEXT_PUBLIC_URL;

  const addFrame = (data: any) => {
    const lineStats = [];
    for (const frame in data) {
      lineStats.push(JSON.parse(data[frame]));
    }
    setFrames(lineStats);
  };

  const handleName = (name: string) => {
    setName(name);
  };

  useEffect(() => {
    if (name) {
      axios.get(url + "playerline/" + name).then((response) => {
        addFrame(response.data);
      });
    } else {
      axios.get(url + "line/" + numLine).then((response) => {
        addFrame(response.data);
      });
    }
  }, [numLine, name]);

  return (
    <VStack spacing={5}>
      <Heading>Lines Page</Heading>
      {/* <Container maxW="container.sm">
        <Input
          variant="filled"
          value={name}
          onChange={handleTextChange}
          placeholder="Enter a name to search for"
          size="sm"
        />
      </Container> */}
      <SearchForm handleSubmit={handleName} />

      <Container maxW="container.sm">
        <NumberInput
          onChange={(value) => setNumLines(Number(value))}
          value={numLine}
          max={1000}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Container>

      <Tabs isFitted size="sm">
        <TabList>
          <Tab>Base</Tab>
          <Tab>Defense</Tab>
          <Tab>Offense</Tab>
        </TabList>
        <TabPanels>
          {frames.map((frame: any, index: number) => (
            <TabPanel key={`${frame}`}>
              <DataTable
                headers={Object.keys(frame[0]).map((header) => {
                  return {
                    Header: header,
                    accessor: header,
                  };
                })}
                table={frame}
                key={index}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default Line;
