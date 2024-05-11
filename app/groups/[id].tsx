import { StyleSheet } from "react-native";

import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import React, { useEffect, useState } from "react";
import { UserProviderType, useActiveUser } from "@/utils/AppContext";
import GroupCard from "@/components/GroupCard";
import { GroupType } from "@/utils/types";
import { getUserGroupRanking, isObjectEmpty } from "@/utils/utils";

export default function GroupPage() {
  const { id, name } = useLocalSearchParams();

  return (
    <View>
      <Text>
        Hello world, from group: {name} ({id})
      </Text>
    </View>
  );
}
