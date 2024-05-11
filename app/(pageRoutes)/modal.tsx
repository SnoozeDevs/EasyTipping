import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
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
