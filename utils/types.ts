export type TUserRecord = {
  displayName: string,
  userID: string,
  email: string,
  groups: {
    [key: string]: TGroupType;
  };
  selectedLeague?: string;
}

export type TGroupType = {
  groupId: string;
  groupName: string;
  isAdmin: boolean;
  currentRank?: string
  tips?: Array<string>;
  results?: Array<string>;
  league: string
}