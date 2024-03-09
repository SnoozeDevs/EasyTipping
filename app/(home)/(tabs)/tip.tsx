import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import styled from "styled-components/native";
import { getCurrentRound, getFixturesForCurrentRound } from "@/utils/utils";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { router } from "expo-router";

export default function TipComponent() {
  const [round, setRound] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>(null);

  //* These two '2024' vars can be put in env vars (or we can use the current year using a date formatter)
  useEffect(() => {
    getCurrentRound("2024", setRound);
  }, []);

  useEffect(() => {
    getFixturesForCurrentRound("2024", round, setFixtures);
  }, [round]);

  console.log("fixtures", fixtures);

  return (
    <Tip>
      <Button
        title="Create or join group"
        onPress={() => {
          router.navigate("/groups");
        }}
        iconName="group-add"
      />
      <Text>This is the tip page</Text>
      <Text>Round: {round}</Text>
      <Text>{fixtures ? fixtures[0].ateam : "Loading..."}</Text>
    </Tip>
  );
}

const Tip = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;
