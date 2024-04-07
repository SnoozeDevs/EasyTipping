export type TUserRecord = {
  displayName: string,
  userID: string,
  email: string,
  groups: Array<GroupType>;
  selectedLeague?: string;
}

type GroupType = {
  groupId: string;
  groupName: string;
  isAdmin: boolean;
  //TODO build the current rank in.
  currentRank?: string
  tips?: Array<string>;
}