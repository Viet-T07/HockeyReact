type StringNumberFunction = (data: any) => string | number;
type ReactFunction = (data: any) => JSX.Element;

interface TableHeaders {
  Header: string;
  accessor: string | StringNumberFunction | ReactFunction;
  sticky?: string;
  sortType?: any;
  desc?: boolean;
}
