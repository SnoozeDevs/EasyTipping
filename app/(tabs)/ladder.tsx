import { StyleSheet, FlatList, Button } from "react-native";
import axios from "axios";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import React, { useCallback, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

export default function Dashboard() {
  const [teamData, setTeamData] = useState([]);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth().currentUser);
  const isFocused = useIsFocused();
  const requestController = new AbortController();

  const getTeams = async () => {
    const teams = await firestore().collection("standings").get();
    return teams;
  };

  console.log(getTeams());

  //TODO ||| Create boolean to return loader when user data is not ready to be displayed,
  //TODO ||| this can be broken up to loading states for different parts of the page, and will provide load states for when data is not
  //TODO ||| fetched from the DB or from firebase (eg to display their name).
  useEffect(() => {
    setCurrentUser(auth().currentUser);
  }, [isFocused]);

  const teamDataFromDB = async () => {
    let teamData: any = [];

    await axios
      .get("https://getteams-5yzqky2riq-uc.a.run.app", {
        signal: requestController.signal,
      })
      .then((res) => {
        res.data.map((team: any) => {
          teamData.push(team.team);
        });

        setTeamData(teamData);
        setIsTeamDataLoaded(true);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  //* Cancel DB calls if page goes out of focus.
  useFocusEffect(
    useCallback(() => {
      if (!isTeamDataLoaded) {
        teamDataFromDB();
      }

      return () => {
        requestController.abort();
      };
    }, [teamDataFromDB])
  );

  const signOutUser = () => {
    auth()
      .signOut()
      .then(() => {
        setCurrentUser(null);
        router.navigate("login");
        console.log("user signed out");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Current user: {currentUser?.displayName}</Text>
      <Button title="Signout" onPress={signOutUser} />
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
