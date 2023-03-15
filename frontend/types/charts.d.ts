interface ILineChartProps {
  categories: string[] | number[];
  series: Array<{
    name: string;
    data: string[] | number[];
  }>;
  title?: string;
  labels?: boolean;
  tooltip?: boolean;
  zoom?: boolean;
}

interface IChartInfo {
  title: string;
  displayNames: Array<string>;
  statNames: Array<string>;
  frameNumber: string;
}

type ChartType = "bar" | "line";
