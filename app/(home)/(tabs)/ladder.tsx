import { StyleSheet, FlatList, Button } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
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
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>User value: {userObject?.displayName}</Text>
      <TextInput
        autoCapitalize="none"
        mode="outlined"
        label="Enter db update"
        onChangeText={(event: any) => {
          setUpdateTestValue(event);
        }}
        value={updateTestValue ?? ""}
        placeholder="Enter email address"
      />
      <Button
        title="Update test record"
        onPress={() => {
          updateUserRecord(
            userObject?.userID!,
            "displayName",
            updateTestValue,
            false
          );
        }}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!isTeamDataLoaded ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={teamData}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
      )}
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
