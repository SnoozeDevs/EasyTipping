import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import React from "react";
import { UserProviderType, useActiveUser } from "@/utils/AppContext";
import Button from "@/components/Button/Button";

export default function ModalScreen() {
  const user: UserProviderType = useActiveUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected League</Text>
      <Button
        title="AFL"
        onPress={() => {
          user.userSetter({
            ...user.userValue,
            selectedLeague: "afl",
          });
        }}
      />
      <Button
        title="Somn else"
        onPress={() => {
          user.userSetter({
            ...user.userValue,
            selectedLeague: "something else",
          });
        }}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/poo.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
