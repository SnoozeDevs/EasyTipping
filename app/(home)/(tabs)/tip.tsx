import { SafeAreaView } from "react-native";

import { Text } from "@/components/Themed";
import styled from "styled-components/native";
import {
  abbreviateTeam,
  convertUnixToLocalTime,
  getCurrentRound,
  getFixturesForCurrentRound,
  uploadTips,
} from "@/utils/utils";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { router } from "expo-router";
import { SegmentedButtons } from "react-native-paper";
import { stdTheme } from "@/themes/stdTheme";
import React from "react";
import { useCurrentUser } from "@/utils/customHooks";
import TippingCard from "@/components/TippingCard";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Swiper from "@/components/Swiper";

export default function TipComponent() {
  //? Variable declarations
  const [round, setRound] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>();
  const user = useCurrentUser(selectedGroup, round);
  const roundArray = Array.from({ length: 30 }, (_, index) => index);
  const startValue = roundArray[parseInt(round)];
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [totalTips, setTotalTips] = useState<any>([]);
  const totalTipLength = Object.keys(totalTips).length;
  const [tipsLoading, setTipsLoading] = useState(false);
  const [currentDatabaseTips, setCurrentDatabaseTips] = useState({});
  const [areTipsInSync, setAreTipsInSync] = useState(true);
  const [areDbTipsLoaded, setAreDbTipsLoaded] = useState(false);
  const selectedGroupIndex: number = user?.groups?.findIndex(
    (obj) => obj.groupId === selectedGroup
  )!;
  const selectedRoundIndex: number = user?.groups[
    selectedGroupIndex
  ]?.tips?.findIndex((obj: any) => obj.round === `${round}`)!;

  //? --- State management to support changes in rounds / tipping groups ---
  //* These two '2024' vars can be put in env vars (or we can use the current year using a date formatter)
  useEffect(() => {
    getCurrentRound("2024", setRound);
  }, []);

  useEffect(() => {
    getFixturesForCurrentRound("2024", round, setFixtures, setFixturesLoading);
  }, [round]);

  //* Automatically select first group when page loads
  useEffect(() => {
    if (user && user.groups?.length > 0 && !selectedGroup) {
      setSelectedGroup(user.groups[0].groupId);
    }
  }, [user]);

  //* Checks if the db tips and the local tips are in sync, logic used to display tip submission button
  //* and to reduce unnecessary writes to the db of duplicate data
  useEffect(() => {
    if (areDbTipsLoaded) {
      JSON.stringify(totalTips) === JSON.stringify(currentDatabaseTips) &&
      totalTipLength === fixtures.length
        ? setAreTipsInSync(true)
        : setAreTipsInSync(false);
    }
  }, [totalTips, areDbTipsLoaded, currentDatabaseTips]);

  //* Fetches users current tips from DB and displays them.
  useEffect(() => {
    if (user?.groups[selectedGroupIndex]) {
      const selectedGroupTips: any = user?.groups[selectedGroupIndex];
      const selectedRoundTips: any =
        selectedGroupTips.tips[selectedRoundIndex]?.roundTips ?? {};
      setTotalTips(selectedRoundTips);
      setCurrentDatabaseTips(selectedRoundTips);
      setAreDbTipsLoaded(true);
    }
  }, [user, round, selectedGroup]);

  //? --- Function logic to support frontend UI ---
  //TODO - update listener for when record is deleted based on new db structure
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

  const fixtureArray = fixtures?.map((match: any, matchIndex: number) => {
    //TODO write google cloud function which updates match record every minute between fixtures
    //! This can easily be done on the free tier, even if we run fixtures updates every min 24/7, it will only use ~40k calls month,
    //! and you get 2 mill free a month
    return (
      <TippingCard
        matchId={match.id}
        totalTips={setTotalTips}
        key={`tip-${matchIndex}`}
        stadium={match.venue}
        homeName={abbreviateTeam(match.hteam)!}
        awayName={abbreviateTeam(match.ateam)!}
        matchTiming={convertUnixToLocalTime(match.unixtime)}
        currentSelection={totalTips[`${match.id}`]}
      />
    );
  });

  return (
    <Tip>
      {user ? (
        user.groups?.length > 0 ? (
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
            <View style={{ display: "flex" }}>
              <Swiper
                values={roundArray}
                selected={setRound}
                startingIndex={startValue}
              />
            </View>

            <ScrollView
              contentContainerStyle={{
                padding: 12,
                display: "flex",
                gap: 32,
                width: "100%",
                height: "auto",
                justifyContent: "center",
                alignItems: "center",
                overflow: "scroll",
                // paddingBottom: "25%",
              }}
              showsVerticalScrollIndicator={false}>
              {fixtureArray}
            </ScrollView>
            {totalTipLength > 0 && !fixturesLoading && !areTipsInSync && (
              <Button
                title={`SUBMIT ${totalTipLength}/${fixtures.length}`}
                onPress={() => {
                  uploadTips(selectedGroup, round, totalTips, setTipsLoading);
                }}
                iconName={totalTipLength > 1 ? "check-all" : "check"}
                loading={tipsLoading}
              />
            )}
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
  background-color: #f3f2f2e3;
`;

const TipContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: center;
  flex: 1;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
