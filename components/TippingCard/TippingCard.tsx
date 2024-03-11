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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
      }}>
      <S.TeamContainer
        onPress={() => {
          console.log("pressed");
        }}>
        <S.TeamText>{homeName}</S.TeamText>
        <S.Image source={ImageFetch[homeName]} />
      </S.TeamContainer>
      <S.InfoContainer>
        {/* <View> */}
        {/* <Text>Thursday 14 March 2024</Text> */}
        <Text>{matchTiming.matchTime}</Text>
        {/* </View> */}
        <View>
          <Text>VS</Text>
        </View>
        <Text>{stadium}</Text>
      </S.InfoContainer>
      <S.TeamContainer>
        <S.Image source={ImageFetch[awayName]} />
        <S.TeamText>{awayName}</S.TeamText>
      </S.TeamContainer>
    </S.TippingCard>
  );
};

export default TippingCard;
