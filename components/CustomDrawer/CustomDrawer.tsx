import { getUserDetails, signOutUser } from "@/utils/utils";
import { ICustomDrawerProps } from "./CustomDrawer.types";
import auth from "@react-native-firebase/auth";
import { View, Text } from "react-native";
import Button from "../Button/Button";
import { useEffect, useMemo, useState } from "react";
import * as S from "./CustomDrawer.styles";
import Drawer from "expo-router/drawer";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useCurrentUser } from "@/utils/customHooks";
import React from "react";
import {
  UserProviderType,
  baseUserListener,
  useActiveUser,
} from "@/utils/AppContext";

const CustomDrawer = ({}: ICustomDrawerProps) => {
  const currentUser = useCurrentUser();
  const userProvider: UserProviderType = useActiveUser();
  const userObject = userProvider.userValue;
  const userSetter = userProvider.userSetter;

  useEffect(() => {
    baseUserListener(userObject!, userSetter);
  }, []);

  return (
    <S.CustomDrawer>
      <S.DrawerContainer>
        <View>
          <Text>Welcome: {currentUser?.displayName}</Text>
          <Text>{currentUser?.email}</Text>
          <Text>User val set in ladder: {userObject?.displayName}</Text>
        </View>
        <S.ButtonContainer>
          <Button
            title="Settings"
            iconName="cog"
            onPress={() => {
              router.navigate("settings");
            }}
          />
          <Button
            title="Profile"
            iconName="account"
            onPress={() => {
              router.navigate("profile");
            }}
          />
          <Button
            title="Dark mode"
            iconName="weather-night"
            onPress={() => {
              console.log("dark mode pressed");
            }}
          />
        </S.ButtonContainer>
      </S.DrawerContainer>
      <Button
        title="Log out"
        iconName="logout"
        onPress={() => {
          router.navigate("login");
        }}
      />
    </S.CustomDrawer>
  );
};

export default CustomDrawer;
