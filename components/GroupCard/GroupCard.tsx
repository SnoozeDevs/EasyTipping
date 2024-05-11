import { IGroupCardProps } from "./GroupCard.types";
import React, { useEffect, useState } from "react";
import * as S from "./GroupCard.styles";
import { Platform, Text } from "react-native";
import { getTotalUsersInGroup, getUserGroupRanking } from "@/utils/utils";
import auth from "@react-native-firebase/auth";
import {
  FontAwesome5,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

const GroupCard = ({
  groupLeague,
  userRank,
  groupName,
  roundForm,
  lastRound,
  groupId,
  onPress,
}: IGroupCardProps) => {
  const isTopThree = userRank === 1 || userRank === 2 || userRank === 3;
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    getTotalUsersInGroup(groupId, setTotalUsers);
  }, []);

  const generateFormIcons = roundForm?.map((match: string, index: number) => {
    switch (match) {
      case "correct":
      case "draw":
        return (
          <FontAwesome
            key={`correct-${index}`}
            name="check-square"
            size={18}
            color={"#2db918"}
          />
        );
      case "incorrect":
        return (
          <Entypo
            key={`incorrect-${index}`}
            name="squared-cross"
            size={19}
            color={"#f52a14"}
          />
        );

      default:
        return <MaterialIcons name="pending" color={"#3478F6"} size={19} />;
    }
  });

  const parseLeagueIcon = (
    leagueName: string,
    iconSize: number,
    iconColour: string
  ) => {
    switch (leagueName) {
      case "afl":
        return (
          <Ionicons
            name="american-football-outline"
            size={iconSize}
            color={iconColour}
          />
        );
      default:
        return (
          <MaterialIcons name="sports" size={iconSize} color={iconColour} />
        );
    }
  };

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
      onPress={onPress}>
      <S.GroupContentContainer>
        <S.GroupNameContainer>
          <S.GroupName>{groupName}</S.GroupName>
          <Ionicons name="arrow-forward" size={22} color={"#3478F6"} />
        </S.GroupNameContainer>
        <S.LeagueContainer>
          <S.LeagueName>{groupLeague}</S.LeagueName>
          {parseLeagueIcon(groupLeague, 18, "#fff")}
        </S.LeagueContainer>
      </S.GroupContentContainer>
      <S.RoundRankContainer>
        <S.GroupRank>
          {totalUsers ? (
            <>
              <S.RankText>Rank: {userRank}</S.RankText>
              {isTopThree && (
                <FontAwesome5 name="medal" size={18} color="#111" />
              )}
              <S.TotalText>of {totalUsers}</S.TotalText>
            </>
          ) : (
            <Text>Loading rank...</Text>
          )}
        </S.GroupRank>
        {lastRound && (
          <S.RoundContainer>
            <S.RoundText>Round {lastRound} form</S.RoundText>
            <S.IconContainer>{generateFormIcons}</S.IconContainer>
          </S.RoundContainer>
        )}
      </S.RoundRankContainer>
    </S.GroupCard>
  );
};

export default GroupCard;
