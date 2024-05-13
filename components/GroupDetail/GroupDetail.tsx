import { IGroupDetailProps } from "./GroupDetail.types";
import * as S from "./GroupDetail.styles";
import React from "react";
import { Platform, Text } from "react-native";
import { renderNumberTail } from "@/utils/Generic/utils";

const GroupDetail = ({
  groupData,
  groupId,
  groupName,
  userRank,
}: IGroupDetailProps) => {
  groupData && console.log("Data in group detail", groupData);

  const renderPodium = Object.keys(groupData ?? {})
    .slice(0, 3)
    .map((group: string) => {
      return (
        <S.PodiumContainer key={`group-${group}`}>
          <Text>{renderNumberTail(Number(group) + 1)}</Text>
          <Text>{groupData[group].name}</Text>
        </S.PodiumContainer>
      );
    });

  return (
    <S.GroupDetail>
      <S.GroupRank>
        Rank | <S.RankCopy>{renderNumberTail(Number(userRank))}</S.RankCopy>
      </S.GroupRank>
      <S.LeaderboardContainer
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
        {renderPodium}
      </S.LeaderboardContainer>
    </S.GroupDetail>
  );
};

export default GroupDetail;
