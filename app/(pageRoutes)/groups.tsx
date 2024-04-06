import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Button from "@/components/Button";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import { useState } from "react";
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
  const userProvider: UserProviderType = useActiveUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
          groupUpdateListener(userProvider.userValue!, userProvider.userSetter);
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
