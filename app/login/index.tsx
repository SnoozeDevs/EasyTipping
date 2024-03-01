import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, TextInput } from "react-native";
import * as S from "./login.styles";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link, Redirect } from "expo-router";

import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import { router } from "expo-router";
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from "react-native-paper";

export default function Login() {
  const searchParams = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasEnteredDetails, setHasEnteredDetails] = useState(false);
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);

  const validateInput = () => {};

  useEffect(() => {
    if (searchParams.email) {
      setEmail(searchParams?.email as string);
    }
  }, [searchParams]);
  // const [isEnabled, setIsEnabled] = useState(false); //todo toggle secureTextEntry prop on password entry
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState); //todo toggle secureTextEntry prop on password entry

  useEffect(() => {
    if (email && password) {
      setHasEnteredDetails(true);
    }
  }, [email, password]);

  const loginUser = () => {
    //TODO Add regex to validate email before submission.
    let hasError = false;

    setEmailHasError(false);
    setPasswordHasError(false);

    if (email === "") {
      hasError = true;
      setEmailHasError(true);
    }

    if (password === "") {
      hasError = true;
      setPasswordHasError(true);
    }

    if (hasError) {
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("User account logged in!", res);
        router.navigate("/dashboard");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
          setEmailHasError(true);
        }
        if (error.code === "auth/invalid-email") {
          setEmailHasError(true);
          console.log("That email address is invalid!");
        }

        if (error.code === "auth/invalid-credential") {
          setPasswordHasError(true);
          console.log("That email address is invalid!");
        }
        console.error(error);
      });
  };

  return (
    <S.Login>
      <PaperTextInput
        autoCapitalize="none"
        mode="outlined"
        label="Email"
        onChangeText={(event: any) => {
          setEmail(event);
        }}
        error={emailHasError}
        value={email ?? ""}
        placeholder="Enter email address"
      />
      <PaperTextInput
        autoCapitalize="none"
        mode="outlined"
        secureTextEntry //todo toggle prop (boolean)
        right={<PaperTextInput.Icon icon="eye" />} //todo create onPress to toggle secureTextEntry prop
        label="Password"
        error={passwordHasError}
        onChangeText={(event: any) => {
          setPassword(event);
        }}
        value={password ?? ""}
        placeholder="Enter password"
      />
      <PaperButton icon="" mode="contained" onPress={loginUser}>
        Login
      </PaperButton>

      <Link href="/signup/" asChild>
        <Pressable>
          <S.Link>Create an account</S.Link>
        </Pressable>
      </Link>
    </S.Login>
  );
}
