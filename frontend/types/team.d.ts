interface Team {
  name: string;
  link?: string;
  id?: number;
  venue?: Venue;
  abbreviation?: string;
  teamName?: string;
  locationName?: string;
  firstYearOfPlay?: string;
  division?: Division;
  conference?: CurrentTeam;
  franchise?: Franchise;
  shortName?: string;
  officialSiteUrl?: string;
  franchiseId?: number;
  active?: boolean;
}

interface Division {
  id: number;
  name: string;
  nameShort?: string;
  link: string;
  abbreviation?: string;
}

interface Franchise {
  franchiseId: number;
  teamName: string;
  link: string;
}

interface Season {
  // counts playoffs as separate season
  seasonId: number | null; // ex 20202021
  teamId: number | null;
  gameTypeId: number | null; // 2 for regular season, 3 for playoffs
  gamesPlayed: number | null;
  wins: number | null;
  losses: number | null;
  overtimeLosses: number | null;
  ties: number | null;
  points: number | null;
  seriesTitle: string | null; // null if missed playoffs
  decision: string | null; // "W" if won cup, "L" if did not
  conferenceName: string | null;
  conferenceSequence: string | null; // Placement
  divisionName: string | null;
  divisionSequence: string | null;
  leagueSequence: string | null;
}

interface Franchises {
  id: number;
  firstSeasonId: number;
  fullName: string;
  lastSeasonId: number | null;
  mostRecentTeamId: number;
  teamAbbrev: string;
  teamCommonName: string;
  teamPlaceName: string;
}

interface TeamInfo {
  // https://statsapi.web.nhl.com/api/v1/teams/12 -> result of this api
  id: number;
  name: string;
  abbreviation: string;
  firstYearOfPlay: string;
  franchiseId: number;
  teamAbbrev: string;
  active: boolean;
  officialSiteUrl: string;
  venue: { id: number; name: string; city: string };
  division: { id: number; name: string; nameShort: string };
  conference: { id: number; name: string };
}

interface Venue {
  id: number;
  name: string;
  link: string;
  city: string;
  timeZone: TimeZone;
}

interface TimeZone {
  id: string;
  offset: number;
  tz: string;
}

interface Type {
  displayName: string;
  gameType: null;
}

type DivisionName = "Metropolitan" | "Atlantic" | "Central" | "Pacific";

type Situations = "all" | "other" | "5on5" | "4on5" | "5on4";
