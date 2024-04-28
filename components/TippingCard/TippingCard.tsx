import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ITippingCardProps } from "./TippingCard.types";
import * as S from "./TippingCard.styles";
import { Image, Platform, Text, View } from "react-native";
import { ImageFetch, convertUnixToLocalTime } from "@/utils/utils";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const TippingCard = ({
  matchData: {
    homeName,
    awayName,
    matchTiming,
    stadium,
    matchId,
    isFirstMatch,
    setShowMarginSelector,
  },
  tipData: {
    totalTips,
    currentSelection,
    disabledTips = false,
    tipResult,
    selectedMargin,
  },
}: ITippingCardProps) => {
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (selected) {
      totalTips((prevTotalTips: any) => ({
        ...prevTotalTips,
        margin: selectedMargin,
        [matchId]: selected,
      }));
    }
  }, [selected, selectedMargin]);

  useEffect(() => {
    setSelected(currentSelection);
  }, [currentSelection]);

  const parseTipResult = (
    tippingState: string | undefined,
    isTippingDisabled: boolean
  ) => {
    //* Check if there is a state value (not undefined)
    if (tippingState) {
      return tippingState;
    } else if (isTippingDisabled) {
      return "complete";
    } else {
      return "scheduled";
    }
  };

  const tippingResult = parseTipResult(tipResult, disabledTips);

  const parseCardIcon = (tippingState: string, iconSize: number) => {
    switch (tippingState) {
      case "correct":
        return (
          <MaterialIcons
            name="check-circle-outline"
            size={iconSize}
            color={"#2db918"}
          />
        );

      case "incorrect":
        return (
          <Entypo name="circle-with-cross" size={iconSize} color={"#f52a14"} />
        );

      case "draw":
        return (
          <FontAwesome name="handshake-o" size={iconSize} color={"#2db918"} />
        );

      case "complete":
        return (
          <MaterialIcons name="lock-outline" size={iconSize} color={"#111"} />
        );

      case "scheduled":
        return (
          <MaterialIcons name="lock-open" size={iconSize} color={"#111"} />
        );

      default:
        return "";
    }
  };

  return (
    <S.TippingCard
      style={{
        ...Platform.select({
          ios: {
            shadowColor: "#171717",
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          },
          android: {
            elevation: 5,
          },
        }),
      }}>
      <S.HomeTeam
        $tipResult={tippingResult}
        $disabled={disabledTips}
        $selected={selected === homeName}
        onPress={() => {
          setSelected(homeName);
          isFirstMatch && setShowMarginSelector(true);
        }}
        disabled={disabledTips}>
        <S.TeamText>{homeName}</S.TeamText>
        <S.Image source={ImageFetch[homeName]} />
      </S.HomeTeam>
      <S.InfoContainer>
        <S.InformationText>{matchTiming.matchTime}</S.InformationText>
        <S.TipStatus>{parseCardIcon(tippingResult, 26)}</S.TipStatus>
        {isFirstMatch && selectedMargin! > -1 && (
          <S.MarginText>
            {selectedMargin}pt{" "}
            <MaterialCommunityIcons name="margin" size={12} />{" "}
          </S.MarginText>
        )}
        <S.InformationText>{stadium}</S.InformationText>
      </S.InfoContainer>
      <S.AwayTeam
        $tipResult={tippingResult}
        $disabled={disabledTips}
        $selected={selected === awayName}
        onPress={() => {
          setSelected(awayName);
          isFirstMatch && setShowMarginSelector(true);
        }}
        disabled={disabledTips}>
        <S.Image source={ImageFetch[awayName]} />
        <S.TeamText>{awayName}</S.TeamText>
      </S.AwayTeam>
    </S.TippingCard>
  );
};

export default TippingCard;
