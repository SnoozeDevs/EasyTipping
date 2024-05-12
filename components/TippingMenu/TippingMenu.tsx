import { ITippingMenuProps } from "./TippingMenu.types";
import * as S from "./TippingMenu.styles";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { stdTheme } from "@/themes/stdTheme";
import {
  UserProviderType,
  useActiveUser,
  baseUserListener,
  tipUpdateListener,
} from "@/utils/AppContext";
import { TUserRecord } from "@/utils/types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { SafeAreaView, View, ScrollView } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { Picker } from "react-native-wheel-pick";
import TippingCard, { MatchData, TipData } from "../TippingCard";
import auth from "@react-native-firebase/auth";
import { Text } from "react-native";
import Button from "../Button/Button";
import Swiper from "@/components/Swiper";
import {
  isObjectEmpty,
  convertUnixToLocalTime,
  abbreviateTeam,
} from "@/utils/Generic/utils";
import { destructureGroupData } from "@/utils/Groups/utils";
import {
  getCurrentRound,
  getFixturesForCurrentRound,
  uploadTips,
} from "@/utils/Tips/utils";

const TippingMenu = ({}: ITippingMenuProps) => {
  //! Todo - delete groups from test1 user, and then re-run task runner with this value added
  //! test using both for in and forEach loops and assess.

  //* Variable declarations
  const [round, setRound] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [fixtureLength, setFixtureLength] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<any>("");
  const roundArray = Array.from({ length: 30 }, (_, index) => index);
  const startValue = roundArray[parseInt(round)];
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [totalTips, setTotalTips] = useState<any>({});
  const [totalTipLength, setTotalTipLength] = useState(0);
  const [tipResults, setTipResults] = useState<any>({});
  const [tipsLoading, setTipsLoading] = useState(false);
  const userProvider: UserProviderType = useActiveUser();
  const userObject = userProvider.userValue;

  //* -------------- WIP: Bottom sheet start ------------------------
  const snapPoints = useMemo(() => ["50%"], []);
  const [sheetIndex, setSheetIndex] = useState<any>(-1);
  const [showMarginSelector, setShowMarginSelector] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  //* This will have to be the tip value from the DB -> no carrying over into the tipping card
  const [activeMargin, setActiveMargin] = useState(totalTips["margin"]);
  const [selectedMargin, setSelectedMargin] = useState<number>(activeMargin);

  const marginArray = Array.from({ length: 101 }, (_, index) =>
    index.toString()
  );
  const handleOpen = () => {
    bottomSheetRef.current?.expand();
  };
  const handleClose = () => {
    bottomSheetRef.current?.close();
  };

  const handleSheetChanges = useCallback((index: any) => {
    setSheetIndex(index);
    if (index === -1) {
      setShowMarginSelector(false);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  //* -------------- Bottom sheet end ------------------------

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

  //* --- State management to support changes in rounds / tipping groups ---
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
    const userGroupExists = userObject && !isObjectEmpty(userObject.groups);
    userGroupExists && !selectedGroup
      ? setSelectedGroup(Object.values(userObject.groups)[0].groupId)
      : "";
  }, [userObject?.groups]);

  useEffect(() => {
    if (selectedGroup && userObject) {
      fetchDatabaseTips(userObject, selectedGroup);
    }
    //! Test if the user object in the dependency array is efficient for performance
  }, [selectedGroup, round, userObject]);

  useEffect(() => {
    setTotalTipLength(Object.keys(totalTips).length);
    //! This only works if the user switches rounds between setting their tip
    setSelectedMargin(totalTips["margin"]);
  }, [totalTips]);

  //* --- Tip fetch function logic to support frontend UI ---

  const fetchDatabaseTips = (userRecord: TUserRecord, selectedGroup: any) => {
    if (!userRecord || !userRecord.groups) {
      console.log("User record or groups not defined");
      return;
    }

    if (!userRecord.groups[selectedGroup]) {
      console.log("Selected group not found");
      return;
    }

    const userHasResults = round in userRecord.groups[selectedGroup].results!;
    const userHasTips = round in userRecord.groups[selectedGroup].tips!;

    if (userHasTips) {
      setTotalTips(userRecord.groups[selectedGroup].tips![round]);
      setSelectedMargin(totalTips["margin"]);
      setTotalTipLength(
        Object.keys(userRecord.groups[selectedGroup].tips![round]).length
      );
    } else {
      setTotalTips({});
      setSelectedMargin(-1);
      setTotalTipLength(0);
    }

    userHasResults
      ? setTipResults(userRecord.groups[selectedGroup].results![round])
      : setTipResults({});
  };

  const parseTippingGroups = (groupData: any) => {
    const mappedArray: any = [];

    for (const key in groupData) {
      const objectKey: any = key;
      const element = userObject?.groups[objectKey]!;

      const mappedObject = {
        value: element.groupId,
        label: element.groupName,
        style:
          Object.keys(groupData).length < 2
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
    }

    return mappedArray;
  };

  const fixtureArray = fixtures?.map((match: any, matchIndex: number) => {
    let matchId = "";
    match.id in totalTips ? (matchId = match.id) : (matchId = "");

    const matchTiming = () => {
      //* Inserts the match day and date above tipping card
      const unixConversion = convertUnixToLocalTime(match.unixtime);

      //* First match of round (will always render date)
      if (matchIndex - 1 <= 0) {
        return <Text>{unixConversion.matchDate}</Text>;
      }
      //* Compare current index with current index - 1, if they are different, render date
      else if (
        unixConversion.matchDate !==
        convertUnixToLocalTime(fixtures[matchIndex - 1].unixtime).matchDate
      ) {
        return <Text>{unixConversion.matchDate}</Text>;
      } else {
        return;
      }
    };

    const matchDataObject: MatchData = {
      homeName: abbreviateTeam(match.hteam)!,
      awayName: abbreviateTeam(match.ateam)!,
      matchTiming: convertUnixToLocalTime(match.unixtime),
      stadium: match.venue,
      matchId: match.id,
      isFirstMatch: fixtures.indexOf(match) === 0,
      setShowMarginSelector: setShowMarginSelector,
    };

    const tipDataObject: TipData = {
      totalTips: setTotalTips,
      currentSelection: totalTips[`${matchId}`],
      disabledTips: match.matchStarted,
      tipResult: tipResults[`${matchId}`],
      selectedMargin: selectedMargin,
    };

    return (
      <S.CardContainer key={`tip-${matchIndex}`}>
        <S.MatchText>{matchTiming()}</S.MatchText>
        <TippingCard matchData={matchDataObject} tipData={tipDataObject} />
      </S.CardContainer>
    );
  });

  //* Render if user hasn't loaded
  if (!userObject) {
    return <Text>Loading User...</Text>;
  }

  //* Render if user does not have any groups
  if (isObjectEmpty(userObject.groups)) {
    return (
      <S.ButtonContainer>
        <Button
          title="Create or Join Group"
          onPress={() => {
            router.navigate("/find-group");
          }}
          iconName="account-group"
        />
      </S.ButtonContainer>
    );
  }

  //* Main tip container render.
  return (
    <S.TippingMenu>
      {!userObject.groups ? (
        <Text>Loading fixtures and groups...</Text>
      ) : (
        <S.TipContainer>
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
              gap: 12,
              width: "100%",
              height: "auto",
              justifyContent: "center",
              alignItems: "center",
              overflow: "scroll",
              paddingBottom: "10%",
            }}
            showsVerticalScrollIndicator={false}>
            {fixtureArray}
          </ScrollView>
          {/* //TODO name changing here has to change for tip count when matches are completed*/}
          {totalTipLength > 0 &&
            !fixturesLoading &&
            !fixtures[fixtureLength - 1].matchStarted && (
              <Button
                title={`SUBMIT ${totalTipLength}/${fixtureLength}`}
                onPress={async () => {
                  await uploadTips(
                    selectedGroup,
                    round,
                    totalTips,
                    setTipsLoading,
                    selectedMargin
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
          {/* //TODO fix the logic of how this hides / shows  */}
          {showMarginSelector && (
            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={snapPoints}
              backdropComponent={renderBackdrop}
              enablePanDownToClose
              enableDynamicSizing
              containerStyle={{ display: "flex" }}>
              <BottomSheetView
                style={{
                  flex: 1,
                  alignItems: "center",
                  overflow: "scroll",
                }}>
                <Text>Select margin</Text>
                <Picker
                  style={{ backgroundColor: "white", width: 300 }}
                  selectedValue={selectedMargin}
                  pickerData={marginArray}
                  onValueChange={(value: number) => {
                    setActiveMargin(value);
                  }}
                />

                <S.MarginButton
                  title="Confirm margin"
                  iconName="check-decagram"
                  mode="contained"
                  labelStyle={{ fontSize: 18 }}
                  onPress={() => {
                    setSelectedMargin(activeMargin);
                    handleClose();
                  }}
                />
              </BottomSheetView>
            </BottomSheet>
          )}
        </S.TipContainer>
      )}
    </S.TippingMenu>
  );
};

export default TippingMenu;
