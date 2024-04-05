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
import TippingCard from "@/components/TippingCard";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Swiper from "@/components/Swiper";
import {
  UserProviderType,
  useActiveUser,
  baseUserListener,
  tipUpdateListener,
} from "@/utils/AppContext";
import { TUserRecord } from "@/utils/types";

export default function TipComponent() {
  //? Variable declarations
  const [round, setRound] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>("");
  const roundArray = Array.from({ length: 30 }, (_, index) => index);
  const startValue = roundArray[parseInt(round)];
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [totalTips, setTotalTips] = useState<any>({});
  const [totalTipLength, setTotalTipLength] = useState(0);
  const [tipsLoading, setTipsLoading] = useState(false);
  const userProvider: UserProviderType = useActiveUser();
  const userObject = userProvider.userValue;

  useEffect(() => {
    baseUserListener(userObject!, userProvider.userSetter);
    getCurrentRound("2024", setRound);
  }, []);

  //? --- State management to support changes in rounds / tipping groups ---
  useEffect(() => {
    getFixturesForCurrentRound("2024", round, setFixtures, setFixturesLoading);
  }, [round]);

  //* Automatically select first group when page loads
  useEffect(() => {
    const userGroupExists = userObject && userObject.groups?.length > 0;
    userGroupExists && !selectedGroup
      ? setSelectedGroup(userObject.groups[0].groupId)
      : "";
  }, [userObject?.groups]);

  useEffect(() => {
    if (selectedGroup !== undefined && userObject) {
      fetchDatabaseTips(userObject, selectedGroup);
    }
  }, [selectedGroup, round]);

  useEffect(() => {
    const userGroupExists = userObject && userObject.groups?.length > 0;
    if (userObject?.groups && userGroupExists) {
      setSelectedGroup(userObject.groups[0].groupId);
    }
  }, [userObject]);

  //? --- Function logic to support frontend UI ---

  const fetchDatabaseTips = (
    userRecord: TUserRecord,
    selectedGroup: string
  ) => {
    if (!userRecord || !userRecord.groups) {
      console.log("User record or groups not defined");
      return;
    }

    const selectedGroupIndex: number = userRecord?.groups?.findIndex(
      (obj) => obj.groupId === selectedGroup
    )!;

    if (selectedGroupIndex < 0) {
      console.log("Selected group not found");
      return;
    }
    const userHasTips = round in userRecord.groups[selectedGroupIndex].tips!;

    if (userHasTips) {
      setTotalTips(userRecord.groups[selectedGroupIndex].tips![round]);
      setTotalTipLength(
        Object.keys(userRecord.groups[selectedGroupIndex].tips![round]).length
      );
    } else {
      setTotalTips({});
    }
  };

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
    let matchId = "";
    match.id in totalTips ? (matchId = match.id) : (matchId = "");

    //TODO write google cloud function which updates match record every minute between fixtures
    return (
      <TippingCard
        matchId={match.id}
        totalTips={setTotalTips}
        key={`tip-${matchIndex}`}
        stadium={match.venue}
        homeName={abbreviateTeam(match.hteam)!}
        awayName={abbreviateTeam(match.ateam)!}
        matchTiming={convertUnixToLocalTime(match.unixtime)}
        currentSelection={totalTips[`${matchId}`]}
      />
    );
  });

  return (
    <Tip>
      {userObject ? (
        userObject.groups?.length > 0 ? (
          <TipContainer>
            <SafeAreaView>
              <SegmentedButtons
                style={{ width: "90%" }}
                value={selectedGroup!}
                theme={stdTheme}
                onValueChange={setSelectedGroup}
                buttons={parseTippingGroups(userObject.groups)}
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
            {totalTipLength > 0 && fixtures && (
              <Button
                title={`SUBMIT ${totalTipLength}/${fixtures.length}`}
                onPress={async () => {
                  await uploadTips(
                    selectedGroup,
                    round,
                    totalTips,
                    setTipsLoading
                  );
                  tipUpdateListener(
                    userObject!,
                    userProvider.userSetter,
                    selectedGroup,
                    round.toString()
                  );
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
