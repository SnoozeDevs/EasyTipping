import { IGroupTableProps } from "./GroupTable.types";
import * as S from "./GroupTable.styles";
import React from "react";
import { Text } from "react-native";
import { Platform } from "react-native";

const GroupTable = ({ groupData }: IGroupTableProps) => {
  console.log("table", groupData);

  return (
    <S.GroupTable>
      <S.TableContainer
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
        <S.TableRow>
          <S.RowContainer>
            <Text>Rank</Text>
          </S.RowContainer>
          <S.RowContainer>
            <Text>Name</Text>
          </S.RowContainer>
          <S.RowContainer>
            <Text>Score</Text>
          </S.RowContainer>
          <S.RowContainer>
            <Text>Margin</Text>
          </S.RowContainer>
          <S.RowContainer>
            <Text>Streak</Text>
          </S.RowContainer>
        </S.TableRow>
        {Object.keys(groupData).map((userKey: string, index: number) => {
          const rank = index + 1;
          return (
            <S.TableRow key={`user-${index}`}>
              <S.RowContainer>
                <Text>{rank}</Text>
              </S.RowContainer>
              <S.RowContainer>
                <Text>{groupData[userKey].name}</Text>
              </S.RowContainer>
              <S.RowContainer>
                <Text>{groupData[userKey].score}</Text>
              </S.RowContainer>
              <S.RowContainer>
                <Text>{groupData[userKey].margin}</Text>
              </S.RowContainer>
            </S.TableRow>
          );
        })}
      </S.TableContainer>
    </S.GroupTable>
  );
};

export default GroupTable;
