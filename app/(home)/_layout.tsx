import React from "react";
import { Platform } from "react-native";
import Drawer from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import CustomDrawer from "@/components/CustomDrawer";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerHideStatusBarOnOpen: Platform.OS === "ios" ? true : false,
      }}
      drawerContent={() => {
        return (
          <DrawerContentScrollView
            contentContainerStyle={{ display: "flex", flex: 1 }}>
            <CustomDrawer />
          </DrawerContentScrollView>
        );
      }}
    />
  );
}
