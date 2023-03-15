/* eslint-disable react/jsx-key */
import React, { useMemo } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  chakra,
  TableContainer,
} from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";
import { useSticky } from "react-table-sticky";

interface IDataTableProps {
  headers: any;
  table: any[];
  title?: string;
  initialSortColumn?: { id: string; desc: boolean };
  LeftComponent?: JSX.Element;
}

const DataTable = ({
  headers,
  table,
  initialSortColumn,
  LeftComponent,
}: IDataTableProps) => {
  const columns = useMemo(() => headers, [headers]);
  const data = useMemo(() => table, [table]);
  const initialState = useMemo(() => {
    if (initialSortColumn) {
      return { sortBy: [initialSortColumn] };
    }
    return {};
  }, [initialSortColumn]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data, initialState }, useSortBy, useSticky);

  return (
    <div>
      {LeftComponent && LeftComponent}
      <TableContainer w="container.xl" borderWidth="1px">
        <Table {...getTableProps()} size="sm">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                    bgColor={index === 0 ? "black" : "gray.900"}
                  >
                    {column.render("Header")}
                    <chakra.span pl="4">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell: any, index) => (
                    <Td
                      {...cell.getCellProps()}
                      bgColor={index === 0 ? "black" : "gray.900"}
                      isNumeric={cell.column.isNumeric}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
