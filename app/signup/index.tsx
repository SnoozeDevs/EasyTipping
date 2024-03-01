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
import * as S from "./signup.styles";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasEnteredDetails, setHasEnteredDetails] = useState(false);
  const [displayName, setDisplayName] = useState("");
  // const [isEnabled, setIsEnabled] = useState(false); //todo toggle secureTextEntry prop on password entry
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState); //todo toggle secureTextEntry prop on password entry

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
          router.navigate(`/login?email=${email}`);
          console.log("That email address is already in use!");
        }
        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }
        console.error(error);
      });
  };

  return (
    <S.Signup>
      <PaperTextInput
        autoCapitalize="none"
        mode="outlined"
        label="Email"
        onChangeText={(event: any) => {
          setEmail(event);
        }}
        value={email ?? ""}
        placeholder="Enter email address"
      />
      <PaperTextInput
        autoCapitalize="none"
        mode="outlined"
        secureTextEntry //todo toggle prop (boolean)
        right={<PaperTextInput.Icon icon="eye" />} //todo create onPress to toggle secureTextEntry prop
        //todo maybe use IconButton? https://tinyurl.com/2m2k5bd6
        label="Password"
        onChangeText={(event: any) => {
          setPassword(event);
        }}
        value={password ?? ""}
        placeholder="Enter password"
      />
      <PaperTextInput
        autoCapitalize="none"
        mode="outlined"
        label="Display Name"
        onChangeText={(event: any) => {
          setDisplayName(event);
        }}
        value={displayName ?? ""}
        placeholder="Enter display name"
      />
      <PaperButton mode="contained" onPress={signUpUser}>
        Sign Up
      </PaperButton>
      <Link href="/login/" asChild>
        <Pressable>
          <S.Link>Already have an account? Log in</S.Link>
        </Pressable>
      </Link>
    </S.Signup>
  );
}
