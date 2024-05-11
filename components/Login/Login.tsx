import { ILoginProps } from "./Login.types";
import * as S from "./Login.styles";
import React, { useCallback, useEffect, useState } from "react";
import { drkTheme } from "@/themes/drkTheme";
import { stdTheme } from "@/themes/stdTheme";
import { UserProviderType, useActiveUser } from "@/utils/AppContext";
import {
  NO_EMAIL_ENTERED,
  EMAIL_INVALID,
  NO_PASSWORD_ENTERED,
  EMAIL_ALREADY_IN_USE,
  INCORRECT_PASSWORD,
} from "@/utils/constants";
import { signOutUser, isEmailValid } from "@/utils/utils";
import { useIsFocused } from "@react-navigation/native";
import {
  useLocalSearchParams,
  useFocusEffect,
  router,
  Link,
} from "expo-router";
import { useColorScheme, Pressable } from "react-native";
import auth from "@react-native-firebase/auth";
import Button from "../Button";
import { TextInput as PaperTextInput } from "react-native-paper";

const Login = ({}: ILoginProps) => {
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
    <S.Login>
      <S.InputContainer>
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
        {emailHasError && <S.Error>{emailErrorMessage}</S.Error>}
      </S.InputContainer>
      <S.InputContainer>
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
        {passwordHasError && <S.Error>{passwordErrorMessage}</S.Error>}
      </S.InputContainer>
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
          <S.StyledLink>Create an account</S.StyledLink>
        </Pressable>
      </Link>
    </S.Login>
  );
};

export default Login;
