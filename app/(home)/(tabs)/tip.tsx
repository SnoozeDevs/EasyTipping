import { SafeAreaView, StyleProp, StyleSheet, ViewStyle } from "react-native";

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
  const [selectedGroup, setSelectedGroup] = useState<any>();
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
        style:
          groupData.length < 2
            ? {
                borderTopRightRadius: 25,
                borderBottomRightRadius: 25,
                borderTopLeftRadius: 25,
                borderBottomLeftRadius: 25,
                borderRightWidth: 1,
              }
            : {},
      };
      mappedArray.push(mappedObject);
    });

    return mappedArray;
  };

  console.log(fixtures);

  return (
    <Tip>
      {user ? (
        user.groups.length > 0 ? (
          <TipContainer>
            <SafeAreaView>
              <SegmentedButtons
                style={{ width: "90%" }}
                value={selectedGroup!}
                theme={stdTheme}
                onValueChange={setSelectedGroup}
                buttons={parseTippingGroups(user.groups)}
              />
            </SafeAreaView>
            <Heading>Round {round}</Heading>
          </TipContainer>
        ) : (
          <ButtonContainer>
            <Button
              title="Create or Join Group"
              onPress={() => {
                router.navigate("/groups");
              }}
              iconName="account-group"
            />
          </ButtonContainer>
        )
      ) : (
        <Text>Loading...</Text>
      )}
    </Tip>
  );
}

const Tip = styled.View`
  flex: 1;
  padding: 5% 0;
  background-color: #fff;
`;

const TipContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: center;
`;

const Heading = styled.Text`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
