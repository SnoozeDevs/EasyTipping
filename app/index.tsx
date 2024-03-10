import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import React from "react";

export default function Index() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  if (user) {
    user.getIdToken(true).then(() => {
      console.log("User token refreshed");
    });
  }

  // Handle user state changes
  async function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/dashboard" />;
}
