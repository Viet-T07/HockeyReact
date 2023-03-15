import React from "react";

import { Table, Thead, Tr, Th, Tbody, Td, Link } from "@chakra-ui/react";

interface IPlayerListProps {
  playerName: Array<string>;
}

const PlayerList = ({ playerName }: IPlayerListProps) => {
  return playerName ? (
    <div className="playerListTable">
      <Table>
        <Thead>
          <Tr>
            <Th>Player Name</Th>
            <Th>Position</Th>
            <Th>Birthday</Th>
            <Th>Birthplace</Th>
            <Th>Last Team</Th>
          </Tr>
        </Thead>
        <Tbody>
          {playerName.map((player: string) => {
            const info = player.split("|");
            const [id, lastName, firstName, ...restInfo] = info;
            return (
              <Tr key={id}>
                <Td>
                  <Link href={`/player/${id}`}>
                    {firstName} {lastName}
                  </Link>
                </Td>
                <Td>{restInfo[9]}</Td>
                <Td>{restInfo[7]}</Td>
                <Td>
                  {restInfo[4]} {restInfo.slice(5, 7).join(", ")}
                </Td>
                <Td>{restInfo[8]}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  ) : (
    <></>
  );
};

export default PlayerList;
