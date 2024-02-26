import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, TextInput } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasEnteredDetails, setHasEnteredDetails] = useState(false);

  useEffect(() => {
    if (email && password) {
      setHasEnteredDetails(true);
    }
  }, [email, password]);

  const signUpUser = () => {
    auth()
      .createUserWithEmailAndPassword("john@doe.com", "password")
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
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
          console.log(event);
          // setEmail(event.target.value);
        }}
        value={email ?? ""}
        placeholder="Enter email address"
      />
      <TextInput
        onChangeText={(event: any) => {
          console.log(event);
          // setPassword(event.target.value);
        }}
        value={password ?? ""}
        placeholder="Enter password plz"
      />
      <Pressable onPress={signUpUser}>
        <Text>Sign Up TEST</Text>
      </Pressable>
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
