import { Pressable, useColorScheme } from "react-native";
import { Link } from "expo-router";
import auth from "@react-native-firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from "react-native-paper";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import styled from "styled-components/native";
import { useFocusEffect } from "@react-navigation/native";
import { createUserRecord, isEmailValid } from "@/utils/utils";
import {
  NO_EMAIL_ENTERED,
  EMAIL_INVALID,
  NO_PASSWORD_ENTERED,
  NO_DISPLAY_NAME,
  EMAIL_ALREADY_IN_USE,
  INCORRECT_PASSWORD,
} from "@/utils/constants";
import React from "react";
import Button from "@/components/Button";

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

  useFocusEffect(
    useCallback(() => {
      setEmailHasError(false);
      setPasswordHasError(false);
      setDisplayNameHasError(false);
      setEmail("");
      setPassword("");
    }, [])
  );

  const signUpUser = async () => {
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

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        const update = {
          displayName: displayName,
        };

        await auth().currentUser?.updateProfile(update);
        const userId = auth().currentUser?.uid!;
        const userDisplayName = auth().currentUser?.displayName!;
        const email = auth().currentUser?.email!;

        await createUserRecord(userId, userDisplayName, email);
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
    <StyledSignup>
      <InputContainer>
        <PaperTextInput
          theme={colors === "light" ? stdTheme : drkTheme}
          autoCapitalize="none"
          mode="outlined"
          label="Email"
          onChangeText={(event: any) => {
            setEmail(event);
            setEmailHasError(false);
          }}
          error={emailHasError}
          value={email ?? ""}
          placeholder="Enter email address"
        />
        {emailHasError && <Error>{emailErrorMessage}</Error>}
      </InputContainer>

      <InputContainer>
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
            setPasswordHasError(false);
          }}
          value={password ?? ""}
          placeholder="Enter password"
        />
        {passwordHasError && <Error>{passwordErrorMessage}</Error>}
      </InputContainer>
      <InputContainer>
        <PaperTextInput
          theme={colors === "light" ? stdTheme : drkTheme}
          autoCapitalize="none"
          mode="outlined"
          error={displayNameHasError}
          label="Display Name"
          onChangeText={(event: any) => {
            setDisplayName(event);
            setDisplayNameHasError(false);
          }}
          value={displayName ?? ""}
          placeholder="Enter display name"
        />
        {displayNameHasError && <Error>{displaNameErrorMessage}</Error>}
      </InputContainer>
      <Button
        fullWidth
        title="Sign up"
        theme="standard"
        iconName="account-plus-outline"
        onPress={signUpUser}
        loading={isSignupLoading}
      />
      <Link href="/login" asChild>
        <Pressable>
          <StyledLink>Already have an account? Log in</StyledLink>
        </Pressable>
      </Link>
    </StyledSignup>
  );
}

export const StyledSignup = styled.View`
  background-color: transparent;
  flex: 1;
  align-items: center;
  justify-content: center;
  align-content: center;
  gap: 8px;
  padding: 60px;
`;

export const StyledLink = styled.Text`
  display: flex;
  text-align: center;
  font-size: 12px;
  color: #000000;
  text-decoration: underline;
`;

export const Error = styled.Text`
  color: red;
  font-size: 10px;
  text-align: left;
  width: 100%;
`;

export const InputContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
