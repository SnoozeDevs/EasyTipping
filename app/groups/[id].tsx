import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import GroupDetail from "@/components/GroupDetail";

export default function GroupPage() {
  const { id, name } = useLocalSearchParams();

  //* Need to get the users rank & collect all of the data that sits in the groups object
  //*   - Display a podium
  //*   - Display the table
  //*   - Display form section (hot / cold tippers)
  //*   - Make table clickable which opens up a modal of the tippers form (and the teams they tipped)
  //!   - ! This means that when a user tips a game - the groups object needs to be updated and associated as well.

  return (
    <GroupDetail
      groupData={{}}
      groupId={id.toString()}
      groupName={name.toString()}
    />
  );
}
