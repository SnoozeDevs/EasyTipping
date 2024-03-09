import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Button from "@/components/Button";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import { useState } from "react";
import { Checkbox } from "react-native-paper";

export default function CreateJoinGroup() {
  const colors = useColorScheme();
  const [groupName, setgroupName] = useState();
  const [groupNameHasError, setGroupNameHasError] = useState<boolean>();
  const [hasJokerRound, setHasJokerRound] = useState(false);
  const [hasPerfectRound, setHasPerfectRound] = useState(false);
  const [hasFinals, setHasFinals] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create new group</Text>
      <Text>Group name</Text>
      <PaperTextInput
        style={{ width: "80%" }}
        theme={colors === "light" ? stdTheme : drkTheme}
        autoCapitalize="none"
        mode="outlined"
        error={groupNameHasError}
        label="Enter group name"
        onChangeText={(event: any) => {
          setgroupName(event);
          setGroupNameHasError(false);
        }}
        value={groupName ?? ""}
        placeholder="Group name"
      />
      <Checkbox
        status={hasJokerRound ? "checked" : "unchecked"}
        onPress={() => {
          setHasJokerRound(!hasJokerRound);
        }}
      />
      <Checkbox
        status={hasPerfectRound ? "checked" : "unchecked"}
        onPress={() => {
          setHasPerfectRound(!hasPerfectRound);
        }}
      />
      <Checkbox
        status={hasFinals ? "checked" : "unchecked"}
        onPress={() => {
          setHasFinals(!hasFinals);
        }}
      />
      <Button
        title="Create group"
        onPress={() => {
          console.log("group group");
        }}
      />

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
