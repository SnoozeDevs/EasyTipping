import React from "react";
import { ITippingCardProps } from "./TippingCard.types";
import * as S from "./TippingCard.styles";
import { Image, Platform, Text, View } from "react-native";
import { ImageFetch, convertUnixToLocalTime } from "@/utils/utils";

const TippingCard = ({
  homeName,
  awayName,
  matchTiming,
  stadium,
}: ITippingCardProps) => {
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
        onPress={() => {
          console.log("pressed");
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
      <S.AwayTeam>
        <S.Image source={ImageFetch[awayName]} />
        <S.TeamText>{awayName}</S.TeamText>
      </S.AwayTeam>
    </S.TippingCard>
  );
};

export default TippingCard;
