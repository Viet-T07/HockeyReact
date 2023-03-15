import React, { useState, useEffect } from "react";

import dynamic from "next/dynamic";
import { Container } from "@chakra-ui/react";

interface IBarChartProps {
  title?: string;
  xData: string[] | number[];
  series: Array<{
    name: string;
    data: string[] | number[];
    type?: string;
  }>;
  stacked?: boolean;
  horizontal?: boolean;
  dataPosition?: string;
  tooltip?: boolean;
  toolbar?: boolean;
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BarChart = ({
  title,
  xData,
  series,
  stacked = false,
  horizontal = false,
  dataPosition = "center",
  tooltip = true,
  toolbar = true,
}: IBarChartProps) => {
  const [dataSample, setDataSample] = useState<any>();
  useEffect(() => {
    if (series) {
      setDataSample({
        options: {
          theme: {
            mode: "dark",
          },
          plotOptions: {
            bar: {
              horizontal: horizontal,
              dataLabels: {
                position: dataPosition,
              },
            },
          },
          chart: {
            stacked: stacked,
            toolbar: {
              show: toolbar,
            },
          },
          xaxis: {
            categories: xData,
            labels: {
              style: {
                colors: "white",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "white",
              },
            },
          },
          title: {
            text: title,
            style: {
              color: "white",
            },
          },
          legend: {
            labels: {
              colors: "white",
              useSeriesColors: false,
            },
          },
          tooltip: {
            enabled: tooltip,
            theme: "dark",
          },
        },
        series: series,
      });
    }
  }, [
    dataPosition,
    horizontal,
    series,
    stacked,
    title,
    toolbar,
    tooltip,
    xData,
  ]);

  return dataSample ? (
    <Container maxW="container.lg">
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="bar"
      />
    </Container>
  ) : (
    <></>
  );
};

export default BarChart;
