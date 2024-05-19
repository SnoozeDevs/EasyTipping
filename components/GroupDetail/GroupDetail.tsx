import { IGroupDetailProps } from "./GroupDetail.types";
import * as S from "./GroupDetail.styles";
import React from "react";
import { Platform, Text, View } from "react-native";
import { renderNumberTail } from "@/utils/Generic/utils";
import Button from "../Button/Button";
import GroupTable from "../GroupTable";

const GroupDetail = ({
  groupData,
  groupId,
  groupName,
  userRank,
}: IGroupDetailProps) => {
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

  if (!groupData) {
    return <Text>Loading group data...</Text>;
  }

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
      <S.GroupRank>Table</S.GroupRank>
      {groupData && <GroupTable groupData={groupData} />}
      <Button
        title="View full table"
        iconName="table"
        iconPosition="right"
        onPress={() => {
          console.log("Open full table");
        }}
      />
    </S.GroupDetail>
  );
};

export default GroupDetail;
