import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { Text, View } from "react-native";
import Button from "@/components/Button";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import React from "react";
import { joinGroup } from "@/utils/utils";
import {
  UserProviderType,
  groupUpdateListener,
  useActiveUser,
} from "@/utils/AppContext";

export default function CreateJoinGroup() {
  const colors = useColorScheme();
  const [groupCode, setGroupCode] = useState<string>("");
  const [joinGroupLoading, setJoinGroupLoading] = useState(false);
  const [groupCodeHasError, setGroupCodeHasError] = useState<boolean>();
  const [selectedLeague, setSelectedLeague] = useState("");
  const userProvider: UserProviderType = useActiveUser();

  useEffect(() => {
    setSelectedLeague(groupCode.split("?")[1]);
  }, [groupCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <Button
        title="Create new group"
        onPress={() => {
          router.navigate("/create-group");
        }}
      />

      <Text>Join existing group</Text>
      <PaperTextInput
        style={{ width: "80%" }}
        theme={colors === "light" ? stdTheme : drkTheme}
        autoCapitalize="none"
        mode="outlined"
        error={groupCodeHasError}
        label="Enter group code "
        onChangeText={(event: any) => {
          setGroupCode(event);
          setGroupCodeHasError(false);
        }}
        value={groupCode ?? ""}
        placeholder="Enter code"
      />
      <Button
        title="Join"
        loading={joinGroupLoading}
        onPress={() => {
          joinGroup(groupCode, setJoinGroupLoading);
          groupUpdateListener(
            userProvider.userValue!,
            userProvider.userSetter,
            selectedLeague
          );
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
