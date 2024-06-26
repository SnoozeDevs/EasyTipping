import { StyleSheet, FlatList, Button, Text, View } from "react-native";

import React, { useCallback, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

import { useFocusEffect } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import {
  UserProviderType,
  baseUserListener,
  useGlobalContext,
} from "@/utils/AppContext";

export default function LadderPage() {
  const [teamData, setTeamData] = useState<Array<string>>([]);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
  const [updateTestValue, setUpdateTestValue] = useState("");
  const { userValue, userSetter }: UserProviderType = useGlobalContext();

  useEffect(() => {
    baseUserListener(userValue!, userSetter);
  }, [auth().currentUser]);

  //* Only calls ladder data from DB if it is not loaded
  useFocusEffect(
    useCallback(() => {
      if (!isTeamDataLoaded) {
      }

      return () => {
        //* Actions that happen when page is taken out of focus (cleanup or cancel processes)
      };
    }, [])
  );

  return (
    <View>
      <Text>WIP...</Text>
    </View>
  );
}
