import { getUserDetails, signOutUser } from "@/utils/utils";
import { ICustomDrawerProps } from "./CustomDrawer.types";
import auth from "@react-native-firebase/auth";
import { View, Text } from "react-native";
import Button from "../Button/Button";
import { useEffect } from "react";
import * as S from "./CustomDrawer.styles";
import { router } from "expo-router";
import React from "react";
import {
  UserProviderType,
  baseUserListener,
  useActiveUser,
} from "@/utils/AppContext";

const CustomDrawer = ({}: ICustomDrawerProps) => {
  const userProvider: UserProviderType = useActiveUser();
  const userObject = userProvider.userValue;
  const userSetter = userProvider.userSetter;

  useEffect(() => {
    baseUserListener(userObject!, userSetter);
  }, [auth().currentUser]);
  return (
    <S.CustomDrawer>
      <S.DrawerContainer>
        <View>
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
