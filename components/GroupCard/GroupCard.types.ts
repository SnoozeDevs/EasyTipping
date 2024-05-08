export interface IGroupCardProps {
  groupName: string;
  userRank: number;
  groupLeague: string;
  roundForm?: Array<string> //todo convert this once we know what the object looks like
  lastRound?: string;
  groupId: string;
}