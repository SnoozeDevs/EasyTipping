import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Button from "@/components/Button";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import { useState } from "react";
import { Switch } from "react-native-paper";

export default function CreateJoinGroup() {
  const colors = useColorScheme();
  const [groupName, setgroupName] = useState();
  const [groupNameHasError, setGroupNameHasError] = useState<boolean>();
  const [hasJokerRound, setHasJokerRound] = useState(true);
  const [hasPerfectRound, setHasPerfectRound] = useState(true);
  const [hasFinals, setHasFinals] = useState(true);

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
      <View>
        <Text>Has Joker round?</Text>
        <Switch
          value={hasJokerRound}
          onValueChange={() => {
            setHasJokerRound(!hasJokerRound);
          }}
        />
      </View>
      <View>
        <Text>Has Perfect round?</Text>
        <Switch
          value={hasPerfectRound}
          onValueChange={() => {
            setHasPerfectRound(!hasPerfectRound);
          }}
        />
      </View>
      <View>
        <Text>Has Finals?</Text>
        <Switch
          value={hasFinals}
          onValueChange={() => {
            setHasFinals(!hasFinals);
          }}
        />
      </View>
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
