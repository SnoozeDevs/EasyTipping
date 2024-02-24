import { StyleSheet, FlatList } from "react-native";
import axios from "axios";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";

export default function TabTwoScreen() {
  const [teamData, setTeamData] = useState([]);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState(false);

  const teamDataFromDB = async () => {
    let teamData: any = [];

    await axios.get("https://getteams-5yzqky2riq-uc.a.run.app").then((res) => {
      res.data.map((team: any) => {
        teamData.push(team.team);
      });
    });

    setTeamData(teamData);
    setIsTeamDataLoaded(true);
  };

  useEffect(() => {
    teamDataFromDB();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
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
