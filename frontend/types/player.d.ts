interface DraftPlayer {
  id: number;
  ageInDays: number;
  ageInYears: number;
  ageInDaysForYear: number;
  amateurClubName: string;
  amateurLeague: string;
  birthDate: Date;
  birthPlace: string;
  countryCode: string;
  csPlayerId: number;
  draftDate: Date;
  draftMasterId: number;
  draftYear: number;
  draftedByTeamId: number;
  firstName: string;
  height: number;
  lastName: string;
  notes: string;
  overallPickNumber: number;
  pickInRound: number;
  playerId: number;
  playerName: string;
  position: string;
  removedOutright: string;
  roundNumber: number;
  shootsCatches: string;
  supplementalDraft: string;
  teamPickHistory: string;
  triCode: string;
  weight: number;
}
interface Person {
  id: number;
  fullName: string;
  link: string;
  firstName: string;
  lastName: string;
  primaryNumber: string;
  birthDate: string;
  currentAge: number;
  birthCity: string;
  birthStateProvince: string;
  birthCountry: string;
  nationality: string;
  height: string;
  weight: number;
  active: boolean;
  alternateCaptain: boolean;
  captain: boolean;
  rookie: boolean;
  shootsCatches: string;
  rosterStatus: string;
  currentTeam: CurrentTeam;
  primaryPosition: PrimaryPosition;
  stats: StatElement[];
}

interface CurrentTeam {
  id?: number;
  name: string;
  link: string;
}

interface StatElement {
  type: Type;
  splits: Split[];
}

interface Split {
  season: string;
  stat: any;
  team: Team;
  league: CurrentTeam;
  sequenceNumber: number;
}

interface SplitStat {
  assists: number;
  goals: number;
  pim: number;
  games: number;
  penaltyMinutes: string;
  plusMinus?: number;
  points: number;
  timeOnIce?: string;
  shots?: number;
  hits?: number;
  powerPlayGoals?: number;
  powerPlayPoints?: number;
  powerPlayTimeOnIce?: string;
  evenTimeOnIce?: string;
  faceOffPct?: number;
  shotPct?: number;
  gameWinningGoals?: number;
  overTimeGoals?: number;
  shortHandedGoals?: number;
  shortHandedPoints?: number;
  shortHandedTimeOnIce?: string;
  blocked?: number;
  shifts?: number;
  timeOnIcePerGame?: string;
  evenTimeOnIcePerGame?: string;
  shortHandedTimeOnIcePerGame?: string;
  powerPlayTimeOnIcePerGame?: string;
}

interface PrimaryPosition {
  code: string;
  name: string;
  type: string;
  abbreviation: string;
}

interface Player {
  jerseyNumber: number;
  person: Person;
  position: { code: string; name: string; type: string; abbreviation: string };
}
