import React from "react";

import { Tabs, TabList, Tab, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";

const tabs = ["Division", "League"];

interface IStandingTabsProps {
  index?: number;
  year: string | string[] | number;
}

export default function StandingTabs({ index = 0, year }: IStandingTabsProps) {
  const router = useRouter();
  const onChange = (index: number) => {
    router.push(`/standings/${tabs[index].toLowerCase()}/${year}`);
  };

  return (
    <Container maxW="container.xl">
      <Tabs isFitted size="lg" defaultIndex={index} onChange={onChange}>
        <TabList>
          {tabs.map((value, index) => (
            <Tab key={index}>{value}</Tab>
          ))}
        </TabList>
      </Tabs>
    </Container>
  );
}
