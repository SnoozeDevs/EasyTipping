import { IGroupCardProps } from "./GroupCard.types";
import React from "react";
import * as S from "./GroupCard.styles";
import { Platform, Text } from "react-native";
import { getUserGroupRanking } from "@/utils/utils";
import auth from "@react-native-firebase/auth";

const GroupCard = ({
  groupLeague,
  userRank,
  groupName,
  upcomingFixture,
}: IGroupCardProps) => {
  return (
    <S.GroupCard
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
      }}
      onPress={async () => {
        console.log("pressed!");
      }}>
      <S.GroupContentContainer>
        <S.GroupName>{groupName}</S.GroupName>
        <S.LeagueContainer>
          <S.LeagueName>{groupLeague}</S.LeagueName>
        </S.LeagueContainer>
      </S.GroupContentContainer>
      <S.GroupContentContainer>
        <S.GroupRank>Rank: {userRank}</S.GroupRank>
        <Text>{upcomingFixture}</Text>
      </S.GroupContentContainer>
    </S.GroupCard>
  );
};

export default GroupCard;
