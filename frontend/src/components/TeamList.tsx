import React from "react";

import { Heading, Image, Link, LinkBox } from "@chakra-ui/react";

interface ITeamListProps {
  title: string;
  division: Array<Team>;
  downsize?: boolean;
}

const TeamList = ({ title, division, downsize = false }: ITeamListProps) => {
  division.sort((a, b) => {
    const firstName = a.name.toUpperCase();
    const secondName = b.name.toUpperCase();
    if (firstName < secondName) {
      return -1;
    } else if (firstName > secondName) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="d-flex flex-column justify-content-center align-center">
      <Heading as="h4" size={downsize ? "md" : "lg"} p={0} m={0}>
        {title}
      </Heading>
      {division.map((team, index) => {
        return (
          <div key={index}>
            <LinkBox
              height={downsize ? "4.2em" : "10em"}
              width={downsize ? "6.5em" : "15em"}
              m={downsize ? 4 : 8}
              p={downsize ? 2 : 0}
              rounded="sm"
            >
              <Link href={`/team/overview/${team.id}`}>
                <Image
                  p={2}
                  src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`}
                />
                <div className="d-flex justify-content-center align-center">
                  {downsize ? team.shortName : team.name}
                </div>
              </Link>
            </LinkBox>
          </div>
        );
      })}
    </div>
  );
};

export default TeamList;
