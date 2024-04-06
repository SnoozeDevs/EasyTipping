import { Pressable, useColorScheme } from "react-native";
import { Link } from "expo-router";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import auth from "@react-native-firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import { router } from "expo-router";
import styled from "styled-components/native";
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from "react-native-paper";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { isEmailValid, signOutUser } from "@/utils/utils";
import {
  NO_EMAIL_ENTERED,
  EMAIL_INVALID,
  NO_PASSWORD_ENTERED,
  EMAIL_ALREADY_IN_USE,
  INCORRECT_PASSWORD,
} from "@/utils/constants";
import React from "react";
import Button from "@/components/Button";
import { UserProviderType, useActiveUser } from "@/utils/AppContext";

export default function LoginPage() {
  const searchParams = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordSecured, setPasswordSecured] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const theme = useColorScheme() === "light" ? stdTheme : drkTheme;
  const isFocused = useIsFocused();
  const userProvider: UserProviderType = useActiveUser();

  useEffect(() => {
    if (isFocused && auth().currentUser) {
      signOutUser();
      userProvider.userSetter({});
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      setEmailHasError(false);
      setPasswordHasError(false);
      setEmail("");
      setPassword("");
    }, [])
  );

  useEffect(() => {
    if (searchParams.email) {
      setEmail(searchParams?.email as string);
    }
  }, [searchParams]);

  const loginUser = () => {
    let hasError = false;
    setEmailHasError(false);
    setPasswordHasError(false);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");

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

    if (hasError) {
      return;
    }

    setIsLoginLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("User account logged in!", res);
        setIsLoginLoading(false);
        router.navigate("/dashboard");
      })
      .catch((error) => {
        //TODO add too many requests error pathway
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
          setEmailHasError(true);
          setEmailErrorMessage(EMAIL_ALREADY_IN_USE);
          setIsLoginLoading(false);
        }
        if (error.code === "auth/invalid-email") {
          setEmailHasError(true);
          setEmailErrorMessage(EMAIL_INVALID);
          setIsLoginLoading(false);
          console.log("That email address is invalid!");
        }

        if (error.code === "auth/invalid-credential") {
          setPasswordHasError(true);
          setPasswordErrorMessage(INCORRECT_PASSWORD);
          setIsLoginLoading(false);
          console.log("Password invalid!");
        }
        console.error(error);
      });
  };

  return (
    <Login>
      <InputContainer>
        <PaperTextInput
          theme={theme}
          style={{ width: "100%" }}
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
          theme={theme}
          style={{ width: "100%" }}
          autoCapitalize="none"
          mode="outlined"
          secureTextEntry={passwordSecured} //todo toggle prop (boolean)
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
          error={passwordHasError}
          onChangeText={(event: any) => {
            setPassword(event);
            setPasswordHasError(false);
          }}
          value={password ?? ""}
          placeholder="Enter password"
        />
        {passwordHasError && <Error>{passwordErrorMessage}</Error>}
      </InputContainer>
      <Button
        fullWidth
        title="Login"
        theme="standard"
        iconName="login"
        onPress={loginUser}
        loading={isLoginLoading}
      />
      <Link href="/signup" asChild>
        <Pressable>
          <StyledLink>Create an account</StyledLink>
        </Pressable>
      </Link>
    </Login>
  );
}

const Login = styled.View`
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
