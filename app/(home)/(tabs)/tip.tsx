import { Text } from "@/components/Themed";
import styled from "styled-components/native";
import auth from "@react-native-firebase/auth";
import {
  abbreviateTeam,
  convertUnixToLocalTime,
  destructureGroupData,
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
import { SafeAreaView, View } from "react-native";
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
  const [fixtures, setFixtures] = useState<any>([]);
  const [fixtureLength, setFixtureLength] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<any>("");
  const roundArray = Array.from({ length: 30 }, (_, index) => index);
  const startValue = roundArray[parseInt(round)];
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [totalTips, setTotalTips] = useState<any>({});
  const [totalTipLength, setTotalTipLength] = useState(0);
  const [tipsLoading, setTipsLoading] = useState(false);
  const userProvider: UserProviderType = useActiveUser();
  const userObject = userProvider.userValue;

  const fetchGroupData = async () => {
    if (userObject?.selectedLeague) {
      const groupObject = await destructureGroupData();
      userProvider.userSetter({
        ...userObject,
        groups: groupObject,
      });
    }
  };

  //* Initial data load calls
  useEffect(() => {
    baseUserListener(userObject!, userProvider.userSetter);
    getCurrentRound("2024", setRound);
    fetchGroupData();
  }, [auth().currentUser]);

  //? --- State management to support changes in rounds / tipping groups ---
  useEffect(() => {
    if (round || round === 0) {
      getFixturesForCurrentRound(
        "2024",
        round,
        setFixtures,
        setFixturesLoading,
        setFixtureLength
      );
    }
  }, [round]);

  //* Automatically select first group when page loads
  useEffect(() => {
    const userGroupExists = userObject && userObject.groups?.length > 0;
    userGroupExists && !selectedGroup
      ? setSelectedGroup(userObject.groups[0].groupId)
      : "";
  }, [userObject?.groups]);

  useEffect(() => {
    if (selectedGroup && userObject) {
      fetchDatabaseTips(userObject, selectedGroup);
    }
  }, [selectedGroup, round]);

  useEffect(() => {
    setTotalTipLength(Object.keys(totalTips).length);
  }, [totalTips]);

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
      setTotalTipLength(0);
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

    const matchTiming = () => {
      const unixConversion = convertUnixToLocalTime(match.unixtime);

      if (matchIndex - 1 <= 0) {
        return <Text>{unixConversion.matchDate}</Text>;
      } else if (
        unixConversion.matchDate !==
        convertUnixToLocalTime(fixtures[matchIndex - 1].unixtime).matchDate
      ) {
        return <Text>{unixConversion.matchDate}</Text>;
      }
    };

    //TODO write google cloud function which updates match record every minute between fixtures
    return (
      <>
        <View>{matchTiming()}</View>
        <TippingCard
          matchId={match.id}
          totalTips={setTotalTips}
          key={`tip-${matchIndex}`}
          stadium={match.venue}
          homeName={abbreviateTeam(match.hteam)!}
          awayName={abbreviateTeam(match.ateam)!}
          unixTime={match.unixtime}
          matchTiming={convertUnixToLocalTime(match.unixtime)}
          currentSelection={totalTips[`${matchId}`]}
        />
      </>
    );
  });

  //* Render if user hasn't loaded
  if (!userObject) {
    return <Text>Loading User...</Text>;
  }

  //* Render if user does not have any groups
  if (userObject.groups?.length === 0) {
    return (
      <ButtonContainer>
        <Button
          title="Create or Join Group"
          onPress={() => {
            router.navigate("/groups");
          }}
          iconName="account-group"
        />
      </ButtonContainer>
    );
  }

  //* Main tip container render.
  return (
    <Tip>
      {!userObject.groups ? (
        <Text>Loading fixtures and groups...</Text>
      ) : (
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
          {totalTipLength > 0 && !fixturesLoading && (
            <Button
              title={`SUBMIT ${totalTipLength}/${fixtureLength}`}
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
