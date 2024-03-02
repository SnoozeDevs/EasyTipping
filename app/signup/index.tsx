import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Pressable,
  TextInput,
  Appearance,
  useColorScheme,
} from "react-native";

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
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";

export default function Signup() {
  const [email, setEmail] = useState("");
  const colors = useColorScheme();
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
        theme={colors === "light" ? stdTheme : drkTheme}
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
        theme={colors === "light" ? stdTheme : drkTheme}
        autoCapitalize="none"
        mode="outlined"
        secureTextEntry
        right={<PaperTextInput.Icon icon="eye" />}
        label="Password"
        onChangeText={(event: any) => {
          setPassword(event);
        }}
        value={password ?? ""}
        placeholder="Enter password"
      />
      <PaperTextInput
        theme={colors === "light" ? stdTheme : drkTheme}
        autoCapitalize="none"
        mode="outlined"
        label="Display Name"
        onChangeText={(event: any) => {
          setDisplayName(event);
        }}
        value={displayName ?? ""}
        placeholder="Enter display name"
      />
      <PaperButton
        mode="contained"
        onPress={signUpUser}
        theme={colors === "light" ? stdTheme : drkTheme}>
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
