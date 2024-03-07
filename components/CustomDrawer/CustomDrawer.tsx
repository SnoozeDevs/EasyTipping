import { getUserDetails, signOutUser } from "@/utils/utils";
import { ICustomDrawerProps, TUserRecord } from "./CustomDrawer.types";
import auth from "@react-native-firebase/auth";
import { Button as NativeButton, View, Text } from "react-native";
import Button from "../Button/Button";
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
      <S.DrawerContainer>
        <View>
          <Text>Welcome: {currentUser?.displayName}</Text>
          <Text>{currentUser?.email}</Text>
        </View>
        <S.ButtonContainer>
          <Button
            title="Settings"
            iconName="settings"
            onPress={() => {
              router.navigate("settings");
            }}
          />
          <Button
            title="Profile"
            iconName="verified-user"
            onPress={() => {
              console.log("profile pressed");
            }}
          />
          <Button
            title="Dark mode"
            iconName="dark-mode"
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
