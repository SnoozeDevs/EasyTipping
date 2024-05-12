import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";

import { Text, View } from "react-native";
import Button from "@/components/Button";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import { useState } from "react";
import { Switch } from "react-native-paper";
import React from "react";
import {
  UserProviderType,
  groupUpdateListener,
  useGlobalContext,
} from "@/utils/AppContext";
import { createGroup } from "@/utils/Groups/utils";

export default function CreateJoinGroup() {
  const colors = useColorScheme();
  const [groupName, setgroupName] = useState<string>();
  const [groupNameHasError, setGroupNameHasError] = useState<boolean>();
  const [hasJokerRound, setHasJokerRound] = useState(true);
  const [hasPerfectRound, setHasPerfectRound] = useState(true);
  const [hasFinals, setHasFinals] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { userValue, userSetter }: UserProviderType = useGlobalContext();

  const parseGroupData = (
    groupName: string,
    jokerRound: boolean,
    perfectRound: boolean,
    finals: boolean
  ) => {
    const groupData = {
      groupName: groupName,
      hasJokerRound: jokerRound,
      hasPerfectRound: perfectRound,
      hasFinals: finals,
    };

    return groupData;
  };

  return (
    <View>
      <Text>Create new group</Text>
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
        loading={isLoading}
        onPress={async () => {
          await createGroup(
            parseGroupData(
              groupName!,
              hasJokerRound,
              hasPerfectRound,
              hasFinals
            ),
            setIsLoading,
            // TODO change this from static to dropdown option in the UI
            "afl"
          );

          await groupUpdateListener(
            userValue!,
            userSetter,
            // TODO change this from static to dropdown option in the UI
            "afl"
          );
        }}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
