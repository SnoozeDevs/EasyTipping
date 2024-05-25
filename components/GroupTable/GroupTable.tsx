import { IGroupTableProps } from "./GroupTable.types";
import * as S from "./GroupTable.styles";
import React from "react";
import { Text } from "react-native";
import { Platform } from "react-native";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

const GroupTable = ({ groupData }: IGroupTableProps) => {
  const renderStreakIcon = (streak: string, iconSize: number) => {
    if (streak === "cold") {
      return (
        <FontAwesome5 name="temperature-low" size={iconSize} color="blue" />
      );
    } else if (streak === "hot") {
      return (
        <FontAwesome5 name="temperature-high" size={iconSize} color="red" />
      );
    } else {
      return (
        <FontAwesome6 name="temperature-half" size={iconSize} color="#111" />
      );
    }
  };

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
                <S.RowText>{rank}</S.RowText>
              </S.RowContainer>
              <S.RowContainer>
                <S.RowText>{groupData[userKey].name}</S.RowText>
              </S.RowContainer>
              <S.RowContainer>
                <S.RowText>{groupData[userKey].score}</S.RowText>
              </S.RowContainer>
              <S.RowContainer>
                <S.RowText>{groupData[userKey].margin}</S.RowText>
              </S.RowContainer>
              <S.RowContainer>
                <S.StreakContainer>
                  {renderStreakIcon(groupData[userKey].formStreak, 20)}
                </S.StreakContainer>
              </S.RowContainer>
            </S.TableRow>
          );
        })}
      </S.TableContainer>
    </S.GroupTable>
  );
};

export default GroupTable;
