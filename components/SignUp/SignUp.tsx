import { ISignUpProps } from "./SignUp.types";
import React, { useCallback, useState } from "react";
import { drkTheme } from "@/themes/drkTheme";
import { stdTheme } from "@/themes/stdTheme";
import * as S from "./SignUp.styles";
import {
  NO_EMAIL_ENTERED,
  EMAIL_INVALID,
  NO_PASSWORD_ENTERED,
  NO_DISPLAY_NAME,
  EMAIL_ALREADY_IN_USE,
  INCORRECT_PASSWORD,
} from "@/utils/constants";
import { useFocusEffect, router, Link } from "expo-router";
import { useColorScheme, Pressable } from "react-native";
import auth from "@react-native-firebase/auth";
import { TextInput as PaperTextInput } from "react-native-paper";
import Button from "../Button";
import { isEmailValid } from "@/utils/Generic/utils";
import { createUserRecord } from "@/utils/Users/utils";

const SignUp = ({}: ISignUpProps) => {
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
    <S.SignUp>
      <S.InputContainer>
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
            setPasswordHasError(false);
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
            setDisplayNameHasError(false);
          }}
          value={displayName ?? ""}
          placeholder="Enter display name"
        />
        {displayNameHasError && <S.Error>{displaNameErrorMessage}</S.Error>}
      </S.InputContainer>
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
          <S.StyledLink>Already have an account? Log in</S.StyledLink>
        </Pressable>
      </Link>
    </S.SignUp>
  );
};

export default SignUp;
