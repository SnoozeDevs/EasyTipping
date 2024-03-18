import React, { useEffect, useState } from "react";
import { ITippingCardProps } from "./TippingCard.types";
import * as S from "./TippingCard.styles";
import { Image, Platform, Text, View } from "react-native";
import { ImageFetch, convertUnixToLocalTime } from "@/utils/utils";

const TippingCard = ({
  homeName,
  awayName,
  matchTiming,
  stadium,
  totalTips,
  matchId,
  currentTips,
}: ITippingCardProps) => {
  const [selected, setSelected] = useState<string>("");
  const currentTipArray = currentTips ?? [];
  const tipArrayLength = Object.keys(currentTipArray).length;

  useEffect(() => {
    if (selected) {
      totalTips((prevTotalTips: any) => ({
        ...prevTotalTips,
        [matchId]: selected,
      }));
    }
  }, [selected]);

  //* Reset the selected tips when the round changes / resets
  //! wip needs to be changed as db data is now being fetched for tips
  useEffect(() => {
    if (tipArrayLength < 1) {
      setSelected("");
    }
  }, [currentTips]);

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
        $selected={selected === homeName}
        onPress={() => {
          setSelected(homeName);
        }}>
        <S.TeamText>{homeName}</S.TeamText>
        <S.Image source={ImageFetch[homeName]} />
      </S.HomeTeam>
      <S.InfoContainer>
        <S.InformationText>{matchTiming.matchTime}</S.InformationText>
        <S.VersusContainer>
          <S.VersusText>VS</S.VersusText>
        </S.VersusContainer>
        <S.InformationText>{stadium}</S.InformationText>
      </S.InfoContainer>
      <S.AwayTeam
        $selected={selected === awayName}
        onPress={() => {
          setSelected(awayName);
        }}>
        <S.Image source={ImageFetch[awayName]} />
        <S.TeamText>{awayName}</S.TeamText>
      </S.AwayTeam>
    </S.TippingCard>
  );
};

export default TippingCard;
