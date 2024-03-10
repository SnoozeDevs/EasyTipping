import { SafeAreaView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import styled from "styled-components/native";
import {
  getCurrentRound,
  getFixturesForCurrentRound,
  getGroups,
} from "@/utils/utils";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { router } from "expo-router";
import { SegmentedButtons } from "react-native-paper";
import { stdTheme } from "@/themes/stdTheme";
import React from "react";
import { useCurrentUser } from "@/utils/customHooks";

export default function TipComponent() {
  const [round, setRound] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState();
  const user = useCurrentUser();

  //* These two '2024' vars can be put in env vars (or we can use the current year using a date formatter)
  useEffect(() => {
    getCurrentRound("2024", setRound);
  }, []);

  useEffect(() => {
    getFixturesForCurrentRound("2024", round, setFixtures);
  }, [round]);

  //* Automatically select first group when page loads
  useEffect(() => {
    if (user && user.groups.length > 0) {
      setSelectedGroup(user.groups[0].groupId);
    }
  }, [user]);

  const parseTippingGroups = (groupData: any) => {
    const mappedArray: any = [];
    groupData.map((group: any) => {
      const mappedObject = {
        value: group.groupId,
        label: group.groupName,
      };
      mappedArray.push(mappedObject);
    });

    return mappedArray;
  };

  return (
    <Tip>
      {user ? (
        user.groups.length > 0 ? (
          <>
            <SegmentedButtons
              value={selectedGroup!}
              theme={stdTheme}
              onValueChange={setSelectedGroup}
              buttons={parseTippingGroups(user.groups)}
            />
            <Text>This is the tip page</Text>
            <Text>Round: {round}</Text>
            <Text>{fixtures ? fixtures[0].ateam : "Loading..."}</Text>
          </>
        ) : (
          <Button
            title="Create or join group"
            onPress={() => {
              router.navigate("/groups");
            }}
            iconName="group-add"
          />
        )
      ) : (
        <Text>Loading...</Text>
      )}
    </Tip>
  );
}

const Tip = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;
