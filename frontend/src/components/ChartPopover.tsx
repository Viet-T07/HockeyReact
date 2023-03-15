import React from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
} from "@chakra-ui/react";

import BarChart from "./BarChart";
import LineChart from "./LineChart";

interface IPopoverProps {
  title: string;
  xLabels: string[] | number[];
  yLabels: Array<{ name: string; data: string[] | number[] }>;
  chartType?: "bar" | "line";
  stacked?: boolean;
}

const ChartPopover = ({
  title,
  xLabels,
  yLabels,
  chartType = "line",
  stacked = false,
}: IPopoverProps) => {
  if (chartType === "bar") {
    return (
      <Popover preventOverflow placement="auto">
        <PopoverTrigger>
          <Stack minW="md" borderWidth="1px" rounded={"xl"}>
            <BarChart
              title={title}
              xData={xLabels}
              series={yLabels}
              toolbar={false}
              tooltip={false}
              stacked={stacked}
            />
          </Stack>
        </PopoverTrigger>
        <PopoverContent boxShadow={"xl"} rounded={"xl"} minW="4xl">
          <PopoverArrow />
          <PopoverCloseButton zIndex={20} />
          <BarChart
            title={title}
            xData={xLabels}
            series={yLabels}
            stacked={stacked}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover preventOverflow placement="auto">
      <PopoverTrigger>
        <Stack minW="md" borderWidth="1px" rounded={"xl"}>
          <LineChart
            title={title}
            xData={xLabels}
            series={yLabels}
            dataLabel={false}
            tooltip={false}
            zoom={false}
          />
        </Stack>
      </PopoverTrigger>
      <PopoverContent boxShadow={"xl"} rounded={"xl"} minW="4xl">
        <PopoverArrow />
        <PopoverCloseButton zIndex={20} />
        <LineChart title={title} xData={xLabels} series={yLabels} />
      </PopoverContent>
    </Popover>
  );
};

export default ChartPopover;
