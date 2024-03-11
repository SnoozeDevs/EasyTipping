import React from "react";
import { ITippingCardProps } from "./TippingCard.types";
import * as S from "./TippingCard.styles";
import { Image, Text, View } from "react-native";

const TippingCard = ({}: ITippingCardProps) => {
  const homeAbbrev = "SYD";

  return (
    <S.TippingCard>
      <S.TeamContainer>
        <S.TeamText>SYD</S.TeamText>
        <S.Image source={require(`../../assets/images/${"SYD"}.png`)} />
      </S.TeamContainer>
      <S.InfoContainer>
        {/* <View> */}
        {/* <Text>Thursday 14 March 2024</Text> */}
        <Text>19:30</Text>
        {/* </View> */}
        <View>
          <Text>VS</Text>
        </View>
        <Text>Gabba</Text>
      </S.InfoContainer>
      <S.TeamContainer>
        <S.Image source={require(`../../assets/images/${"GWS"}.png`)} />
        <S.TeamText>SYD</S.TeamText>
      </S.TeamContainer>
    </S.TippingCard>
  );
};

export default TippingCard;
