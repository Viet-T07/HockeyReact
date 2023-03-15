export const charts = {
  player: [
    {
      title: "Goals",
      displayNames: [
        "Low Danger Goals",
        "Medium Danger Goals",
        "High Danger Goals",
      ],
      statNames: [
        "I_F_lowDangerGoals",
        "I_F_mediumDangerGoals",
        "I_F_highDangerGoals",
      ],
      frameNumber: "offense",
    },
    {
      title: "Expected Goals",
      displayNames: [
        "Low Danger xGoals",
        "Medium Danger xGoals",
        "High Danger xGoals",
      ],
      statNames: [
        "I_F_lowDangerxGoals",
        "I_F_mediumDangerxGoals",
        "I_F_highDangerxGoals",
      ],
      frameNumber: "offense",
    },
    {
      title: "Assists",
      displayNames: ["Primary Assists", "Secondary Assists"],
      statNames: ["I_F_primaryAssists", "I_F_secondaryAssists"],
      frameNumber: "offense",
    },
    {
      title: "Corsi",
      displayNames: ["On Ice Corsi", "Off Ice Corsi"],
      statNames: ["onIce_corsiPercentage", "offIce_corsiPercentage"],
      frameNumber: "base",
    },
    {
      title: "Fenwick",
      displayNames: ["On Ice Fenwick", "Off Ice Fenwick"],
      statNames: ["onIce_fenwickPercentage", "offIce_fenwickPercentage"],
      frameNumber: "base",
    },
  ],
  goalie: [
    {
      title: "Goals Against Average",
      displayNames: ["GAA", "xGAA"],
      statNames: ["Goals Against Average", "Expected Goals Against Average"],
      frameNumber: "base",
    },
    {
      title: "Goals Against",
      displayNames: [
        "Low Danger Goals",
        "Medium Danger Goals",
        "High Danger Goals",
      ],
      statNames: [
        "low danger goals",
        "medium danger goals",
        "high danger goals",
      ],
      frameNumber: "base",
    },
    {
      title: "Goals Against",
      displayNames: ["Goals Saved Above Expected"],
      statNames: ["Goals Saved Above Expected"],
      frameNumber: "base",
    },
  ],
};

export const getChartOptions = (
  categories: string[] | number[],
  chartInfo: IChartInfo,
  advancedStats: any,
  type: ChartType,
  labels = true,
  stacked = false,
  horizontal = false,
  dataPosition = "center",
  title = "",
  tooltip = true,
  zoom = true
) => {
  const chartConfig: any = {
    options: {
      theme: {
        mode: "dark",
      },
      xaxis: {
        categories: categories,
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
        enabled: labels,
      },
      title: {
        text: title,
        style: {
          color: "white",
        },
      },
      tooltip: {
        enabled: tooltip,
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
    series: getSeries(chartInfo, advancedStats),
  };

  if (type === "bar") {
    chartConfig.options.plotOptions = {
      bar: {
        horizontal: horizontal,
        dataLabels: {
          position: dataPosition,
        },
      },
    };
    chartConfig.options.chart.stacked = stacked;
  }

  return chartConfig;
};

export const getSeries = (
  chartInfo: IChartInfo,
  advancedStats: any,
  format = false
) => {
  const stats: Array<{
    name: string;
    data: string[] | number[];
  }> = [];

  if (advancedStats[chartInfo.frameNumber] !== undefined) {
    for (let i = 0; i < chartInfo.displayNames.length; i++) {
      stats.push({
        name: chartInfo.displayNames[i],
        data: format
          ? advancedStats[chartInfo.frameNumber].map(
              (year: any) =>
                Math.round(year[chartInfo.statNames[i]] * 100) / 100
            )
          : advancedStats[chartInfo.frameNumber].map(
              (year: any) => year[chartInfo.statNames[i]]
            ),
      });
    }
  }
  return stats;
};
