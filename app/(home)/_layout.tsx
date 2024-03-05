import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Button, Pressable, View } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Drawer from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { signOutUser } from "@/utils/utils";
import CustomDrawer from "@/components/CustomDrawer";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{ headerShown: false, drawerHideStatusBarOnOpen: true }}
      drawerContent={() => {
        return (
          <DrawerContentScrollView>
            <CustomDrawer />
          </DrawerContentScrollView>
        );
      }}
    />
  );
}
