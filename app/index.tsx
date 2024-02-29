import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import Login from "./login";

export default function Index() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <Redirect href="/signup" />;
  }

  return <Redirect href="/dashboard" />;
}
