import { IDashboardProps } from "./Dashboard.types";
import * as S from "./Dashboard.styles";
import React from "react";
import {
  GroupProviderType,
  UserProviderType,
  useGlobalContext,
} from "@/utils/AppContext";
import { TGroupType } from "@/utils/types";
import { router } from "expo-router";
import GroupCard from "../GroupCard";
import { Text } from "react-native";
import { isObjectEmpty } from "@/utils/Generic/utils";
import { getGroupData } from "@/utils/Groups/utils";

const Dashboard = ({}: IDashboardProps) => {
  const { userValue }: UserProviderType = useGlobalContext();

  //* Display all groups in group card layout
  //*    - display the group name
  //*    - the users place in that group
  //*    - the next upcoming tip (need to confirm if this is possible for an active timer)
  //*    -  the league in the top right corner

  //* The link has to be clickable, and will take the user to a more detailed group tipping screen.
  //*    - This section will show the user the leaderboard and everyones scores
  //*    - Details about other users tips, potentially their form
  //*    - Will also have a leaderboard section of the top 3 users who will be displayed at the header of the page

  //* If the users does not have any group
  //*    - need to think of content to show them
  //*    - potentially some public groups that can be joined - but this is definitely a feature add
  //*       - this would mean in the user flow
  //*    - definitely need a CTA that prompts the user to join or create a group

  //TODO - build in long press on group button that can be used to share group link (copy or potentially share link).

  //* Need fallback to wait for user objects to be loaded
  const groupCards = Object.keys(userValue?.groups! ?? {}).map(
    (group: any, index: number) => {
      if (!isObjectEmpty(userValue?.groups)) {
        const userGroup: TGroupType = userValue?.groups[group]!;
        const rank = Number(userGroup.currentRank) + 1 ?? -1;
        let groupKeys;
        let lastIndex;
        let lastKey: string;
        let lastResult: string;
        let roundForm;

        if (isObjectEmpty(userGroup.results)) {
          return <Text>Group data not found...</Text>;
        }
        groupKeys = Object.keys(userGroup?.results!);
        lastIndex = groupKeys.length - 1;
        lastKey = groupKeys[lastIndex];
        lastResult = userGroup?.results![Number(lastKey)];
        roundForm = Object.values(lastResult);

        return (
          <GroupCard
            key={`group-${index}`}
            groupLeague={userGroup.league}
            groupName={userGroup.groupName}
            userRank={rank}
            roundForm={roundForm}
            lastRound={lastKey}
            groupId={userGroup.groupId}
            onPress={() => {
              router.push({
                pathname: "/groups/[id]",
                params: {
                  id: userGroup.groupId,
                  name: userGroup.groupName,
                  rank: rank,
                  round: lastKey,
                },
              });
            }}
          />
        );
      }
    }
  );

  if (!userValue?.groups) {
    return <Text>Loading groups...</Text>;
  }

  return (
    <S.Dashboard>
      <S.UserHeading>
        Hello <S.DisplayName>{userValue?.displayName}</S.DisplayName>,
      </S.UserHeading>
      {groupCards}
    </S.Dashboard>
  );
};

export default Dashboard;
