import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;
}
