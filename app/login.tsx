import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, TextInput } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link, Redirect } from "expo-router";

import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from "react-native-paper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasEnteredDetails, setHasEnteredDetails] = useState(false);
  // const [isEnabled, setIsEnabled] = useState(false); //todo toggle secureTextEntry prop on password entry
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState); //todo toggle secureTextEntry prop on password entry

  useEffect(() => {
    if (email && password) {
      setHasEnteredDetails(true);
    }
  }, [email, password]);

  const loginUser = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("User account logged in!", res);
        router.navigate("/dashboard");
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
      <PaperTextInput
        mode="outlined"
        label="Email"
        onChangeText={(event: any) => {
          setEmail(event);
        }}
        value={email ?? ""}
        placeholder="Enter email address"
      />
      <PaperTextInput
        mode="outlined"
        secureTextEntry //todo toggle prop (boolean)
        right={<PaperTextInput.Icon icon="eye" />} //todo create onPress to toggle secureTextEntry prop
        label="Password"
        onChangeText={(event: any) => {
          setPassword(event);
        }}
        value={password ?? ""}
        placeholder="Enter password"
      />
      <PaperButton icon="" mode="contained" onPress={loginUser}>
        Login
      </PaperButton>

      <Link href="/signup">
        <PaperButton>go to sign up</PaperButton>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
    padding: 60,
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
