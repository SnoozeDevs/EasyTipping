import { getUserDetails, signOutUser } from "@/utils/utils";
import { ICustomDrawerProps, TUserRecord } from "./CustomDrawer.types";
import auth from "@react-native-firebase/auth";
import { Button, View, Text } from "react-native";
import { useEffect, useMemo, useState } from "react";
import * as S from "./CustomDrawer.styles";
import Drawer from "expo-router/drawer";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useCurrentUser } from "@/utils/customHooks";

const CustomDrawer = ({}: ICustomDrawerProps) => {
  const currentUser = useCurrentUser();

  return (
    <S.CustomDrawer>
      <View>
        <Text>Welcome: {currentUser?.displayName}</Text>
        <Text>Random val: {currentUser?.randomString}</Text>
        <Text>{currentUser?.email}</Text>
      </View>
      <Button
        title="Settings"
        onPress={() => {
          router.navigate("settings");
        }}
      />
      <Button
        title="Profile"
        onPress={() => {
          console.log("profile pressed");
        }}
      />
      <Button
        title="Dark mode"
        onPress={() => {
          console.log("dark mode pressed");
        }}
      />
      <Button
        title="Log out"
        onPress={() => {
          router.navigate("login");
        }}
      />
    </S.CustomDrawer>
  );
};

export default CustomDrawer;
