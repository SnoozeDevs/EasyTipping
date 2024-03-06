import { getUserDetails, signOutUser } from "@/utils/utils";
import { ICustomDrawerProps, TUserRecord } from "./CustomDrawer.types";
import auth from "@react-native-firebase/auth";
import { Button, View, Text } from "react-native";
import { useEffect, useMemo, useState } from "react";
import * as S from "./CustomDrawer.styles";
import Drawer from "expo-router/drawer";
import { router } from "expo-router";

const CustomDrawer = ({}: ICustomDrawerProps) => {
  const [user, setUser] = useState<TUserRecord>();

  //* Updates the user details in the tab as soon as the account auth changes
  //TODO we need to figure out a smarter way to update user state across the app. I think we
  //TODO either have a parent context or pass state between components
  useEffect(() => {
    getUserDetails(auth().currentUser?.uid!, setUser);
  }, [auth().currentUser]);

  return (
    <S.CustomDrawer>
      <View>
        <Text>Welcome: {user?.displayName}</Text>
        <Text>{user?.email}</Text>
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
      <Button title="Log out" onPress={signOutUser} />
    </S.CustomDrawer>
  );
};

export default CustomDrawer;
