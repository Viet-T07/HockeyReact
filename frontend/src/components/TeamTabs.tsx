import React from "react";

import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { CURRENT_SEASON } from "../constants";

const tabs = ["Overview", "Season", "Contracts"];

interface ITeamTabsProps {
  index?: number;
  teamId: string | string[];
}

export default function TeamTabs({ index = 0, teamId }: ITeamTabsProps) {
  const router = useRouter();
  const onChange = (index: number) => {
    if (index === 1) {
      router.push(
        `/team/${tabs[
          index
        ].toLowerCase()}/${teamId}/?season=${CURRENT_SEASON}`,
        undefined,
        { scroll: false }
      );
    } else {
      router.push(`/team/${tabs[index].toLowerCase()}/${teamId}`, undefined, {
        scroll: false,
      });
    }
  };

  return (
    <Tabs
      isFitted
      variant="line"
      defaultIndex={index}
      onChange={onChange}
      width="70%"
    >
      <TabList>
        {tabs.map((value, index) => (
          <Tab
            key={index}
            border="2px"
            _selected={{
              border: "4px",
              bg: "purple.700",
              borderColor: "purple.700",
            }}
          >
            {value}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
