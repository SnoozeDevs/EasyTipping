import { StyleSheet, FlatList, Button, Text, View } from "react-native";

import React, { useCallback, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

import { useFocusEffect } from "@react-navigation/native";
import { getLadder, updateUserRecord } from "@/utils/utils";
import { TextInput } from "react-native-paper";
import {
  UserProviderType,
  baseUserListener,
  useActiveUser,
} from "@/utils/AppContext";

export default function Dashboard() {
  const [teamData, setTeamData] = useState<Array<string>>([]);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
  const [updateTestValue, setUpdateTestValue] = useState("");
  const userProvider: UserProviderType = useActiveUser();
  const userObject = userProvider.userValue;
  useEffect(() => {
    baseUserListener(userObject!, userProvider.userSetter);
  }, [auth().currentUser]);

  //* Only calls ladder data from DB if it is not loaded
  useFocusEffect(
    useCallback(() => {
      if (!isTeamDataLoaded) {
        getLadder(setTeamData, setIsTeamDataLoaded);
      }

      return () => {
        //* Actions that happen when page is taken out of focus (cleanup or cancel processes)
      };
    }, [getLadder])
  );

  return (
    <View>
      <Text>WIP...</Text>
    </View>
  );
}
