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

export default function GroupPage() {
  const { id, name, rank } = useLocalSearchParams();
  const [groupData, setGroupData] = useState();

  // const groupData = useMemo(() => getGroupData(id.toString()), [id]);

  useEffect(() => {
    setTimeout(() => {
      !groupData && getGroupData(id.toString(), setGroupData);
    }, 3000);
  }, [id]);
  console.log("{id}", groupData);

  //* Need to get the users rank & collect all of the data that sits in the groups object
  //*   - Display a podium
  //*   - Display the table
  //*   - Display form section (hot / cold tippers)
  //*   - Make table clickable which opens up a modal of the tippers form (and the teams they tipped)
  //!   - ! This means that when a user tips a game - the groups object needs to be updated and associated as well.

  if (!groupData) {
    return <Text>Loading group data...</Text>;
  }

  return (
    <GroupDetail
      groupData={groupData}
      groupId={id.toString()}
      groupName={name.toString()}
    />
  );
}
