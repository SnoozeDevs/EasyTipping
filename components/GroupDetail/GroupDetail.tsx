import { IGroupDetailProps } from "./GroupDetail.types";
import * as S from "./GroupDetail.styles";
import React from "react";
import { Text } from "react-native";

const GroupDetail = ({ groupData, groupId, groupName }: IGroupDetailProps) => {
  return (
    <S.GroupDetail>
      <Text>
        {groupId}, {groupName}
      </Text>
    </S.GroupDetail>
  );
};

export default GroupDetail;
