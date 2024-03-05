import { StyleSheet, FlatList, Button } from "react-native";
import axios from "axios";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import React, { useCallback, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { getLadder, signOutUser, updateUserRecord } from "@/utils/utils";
import { TextInput } from "react-native-paper";

export default function Dashboard() {
  const [teamData, setTeamData] = useState<Array<string>>([]);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState(auth().currentUser);
  const [user, setUser] = useState<any>();
  const isFocused = useIsFocused();
  const [updateTestValue, setUpdateTestValue] = useState("");

  //TODO ||| Create boolean to return loader when user data is not ready to be displayed,
  //TODO ||| this can be broken up to loading states for different parts of the page, and will provide load states for when data is not
  //TODO ||| fetched from the DB or from firebase (eg to display their name).
  useEffect(() => {
    setCurrentUser(auth().currentUser);
  }, [isFocused]);

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

  //* Fetch real time data from db as soon as their data model changes
  useEffect(() => {
    const userDocChange = firestore()
      .collection("users")
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(
        (snapshot) => {
          console.log("snapshot changed", snapshot.data());
          const data = snapshot.data();
          setUser(data);
        },
        (error) => console.error(error)
      );
    return () => userDocChange();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Current user: {currentUser?.displayName}</Text>
      <Text>Random val: {user?.randomString}</Text>
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
          updateUserRecord(auth().currentUser?.uid!, updateTestValue);
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