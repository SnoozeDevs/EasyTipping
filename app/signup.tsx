import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, TextInput } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link, Redirect } from "expo-router";

import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasEnteredDetails, setHasEnteredDetails] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (email && password) {
      setHasEnteredDetails(true);
    }
  }, [email, password]);

  const signUpUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        const update = {
          displayName: displayName,
          photoUrl: "https://cataas.com/cat",
        };

        await auth().currentUser?.updateProfile(update);
        console.log("User account created & signed in!", res);
        router.navigate("/dashboard");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          router.navigate("/login");
          console.log("That email address is already in use!");
        }
        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(event: any) => {
          setEmail(event);
        }}
        value={email ?? ""}
        placeholder="Enter email address"
      />
      <TextInput
        onChangeText={(event: any) => {
          setPassword(event);
        }}
        value={password ?? ""}
        placeholder="Enter password plz"
      />
      <TextInput
        onChangeText={(event: any) => {
          setDisplayName(event);
        }}
        value={displayName ?? ""}
        placeholder="Enter display name"
      />
      <Pressable onPress={signUpUser}>
        <Text>Sign Up</Text>
      </Pressable>
      <Link href="/login">Have an account? Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
