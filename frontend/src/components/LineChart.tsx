import React, { useState } from "react";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ILineChartProps {
  title?: string;
  xData: string[] | number[];
  series: Array<{
    name: string;
    data: string[] | number[];
  }>;
  dataLabel?: boolean;
  tooltip?: boolean;
  zoom?: boolean;
}

const LineChart = ({
  title,
  xData,
  series,
  dataLabel = true,
  tooltip = true,
  zoom = true,
}: ILineChartProps) => {
  const [dataSample] = useState<any>({
    options: {
      theme: {
        mode: "dark",
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
            colors: ["white"],
          },
        },
      },
      legend: {
        labels: {
          colors: "white",
          useSeriesColors: false,
        },
      },
      dataLabels: {
        enabled: dataLabel,
      },
      title: {
        text: title,
        style: {
          color: "white",
        },
      },
      tooltip: {
        enabled: !tooltip,
        theme: "dark",
      },
      chart: {
        toolbar: {
          show: tooltip,
        },
        zoom: {
          enabled: zoom,
        },
      },
    },
    series: series,
  });

  return (
    <Chart
      options={dataSample.options}
      series={dataSample.series}
      type="line"
    />
  );
};

export default LineChart;
