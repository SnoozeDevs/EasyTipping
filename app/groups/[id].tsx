import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import GroupDetail from "@/components/GroupDetail";
import {
  GroupProviderType,
  UserProviderType,
  groupUpdateListener,
  useGlobalContext,
} from "@/utils/AppContext";
import { getGroupData } from "@/utils/Groups/utils";
import { isObjectEmpty } from "@/utils/Generic/utils";

export default function GroupPage() {
  const { id, name, rank, round } = useLocalSearchParams();
  const groupId = id.toString() as keyof object;
  const userRank = rank.toString();
  const { groupSetter, groupValue }: GroupProviderType = useGlobalContext();

  useEffect(() => {
    getGroupData(groupId, groupSetter, round.toString());
  }, [id]);

  //* Need to get the users rank & collect all of the data that sits in the groups object
  //*   - Display a podium
  //*   - Display the table
  //*   - Display form section (hot / cold tippers)
  //*   - Make table clickable which opens up a modal of the tippers form (and the teams they tipped)
  //!   - ! This means that when a user tips a game - the groups object needs to be updated and associated as well.

  if (isObjectEmpty(groupValue)) {
    return <Text>Loading group data...</Text>;
  }

  return (
    <GroupDetail
      groupData={groupValue[groupId]}
      groupId={id.toString()}
      groupName={name.toString()}
      userRank={userRank}
    />
  );
}
