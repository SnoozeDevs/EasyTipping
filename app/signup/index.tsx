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
import {
  NO_EMAIL_ENTERED,
  isEmailValid,
  EMAIL_INVALID,
  NO_PASSWORD_ENTERED,
  EMAIL_ALREADY_IN_USE,
  INCORRECT_PASSWORD,
  NO_DISPLAY_NAME,
} from "../utils/constants";

export default function Signup() {
  const [email, setEmail] = useState("");
  const colors = useColorScheme();
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordSecured, setPasswordSecured] = useState(true);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [displayNameHasError, setDisplayNameHasError] = useState(false);
  const [displaNameErrorMessage, setDisplayNameErrorMessage] = useState("");

  const signUpUser = () => {
    let hasError = false;
    setEmailHasError(false);
    setPasswordHasError(false);
    setDisplayNameHasError(false);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    setDisplayNameErrorMessage("");

    if (email === "") {
      hasError = true;
      setEmailHasError(true);
      setEmailErrorMessage(NO_EMAIL_ENTERED);
    } else if (!isEmailValid(email)) {
      hasError = true;
      setEmailHasError(true);
      setEmailErrorMessage(EMAIL_INVALID);
    }

    if (password === "") {
      hasError = true;
      setPasswordHasError(true);
      setPasswordErrorMessage(NO_PASSWORD_ENTERED);
    }

    if (displayName === "") {
      hasError = true;
      setDisplayNameHasError(true);
      setDisplayNameErrorMessage(NO_DISPLAY_NAME);
    }

    if (hasError) {
      return;
    }

    setIsSignupLoading(true);

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
          console.log("That email address is already in use!");
          setEmailHasError(true);
          setEmailErrorMessage(EMAIL_ALREADY_IN_USE);
          setIsSignupLoading(false);
        }
        if (error.code === "auth/invalid-email") {
          setEmailHasError(true);
          setEmailErrorMessage(EMAIL_INVALID);
          setIsSignupLoading(false);
          console.log("That email address is invalid!");
        }

        if (error.code === "auth/invalid-credential") {
          setPasswordHasError(true);
          setPasswordErrorMessage(INCORRECT_PASSWORD);
          setIsSignupLoading(false);
          console.log("Password invalid!");
        }
        console.error(error);
      });
  };

  return (
    <S.Signup>
      <S.InputContainer>
        <PaperTextInput
          theme={colors === "light" ? stdTheme : drkTheme}
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
        {emailHasError && <S.Error>{emailErrorMessage}</S.Error>}
      </S.InputContainer>

      <S.InputContainer>
        <PaperTextInput
          theme={colors === "light" ? stdTheme : drkTheme}
          autoCapitalize="none"
          mode="outlined"
          secureTextEntry={passwordSecured}
          error={passwordHasError}
          right={
            <PaperTextInput.Icon
              onPressIn={() => {
                setPasswordSecured(false);
              }}
              onPressOut={() => {
                setPasswordSecured(true);
              }}
              icon="eye"
            />
          }
          label="Password"
          onChangeText={(event: any) => {
            setPassword(event);
          }}
          value={password ?? ""}
          placeholder="Enter password"
        />
        {passwordHasError && <S.Error>{passwordErrorMessage}</S.Error>}
      </S.InputContainer>
      <S.InputContainer>
        <PaperTextInput
          theme={colors === "light" ? stdTheme : drkTheme}
          autoCapitalize="none"
          mode="outlined"
          error={displayNameHasError}
          label="Display Name"
          onChangeText={(event: any) => {
            setDisplayName(event);
          }}
          value={displayName ?? ""}
          placeholder="Enter display name"
        />
        {displayNameHasError && <S.Error>{displaNameErrorMessage}</S.Error>}
      </S.InputContainer>
      <PaperButton
        style={{ width: "100%" }}
        mode="contained"
        loading={isSignupLoading}
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
