import { Pressable, useColorScheme } from "react-native";
import * as S from "./login.styles";
import { Link } from "expo-router";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";
import auth from "@react-native-firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import { router } from "expo-router";
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from "react-native-paper";
import {
  EMAIL_ALREADY_IN_USE,
  EMAIL_INVALID,
  INCORRECT_PASSWORD,
  NO_EMAIL_ENTERED,
  NO_PASSWORD_ENTERED,
  isEmailValid,
} from "../utils/constants";
import { useFocusEffect } from "@react-navigation/native";

export default function Login() {
  const searchParams = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordSecured, setPasswordSecured] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const colors = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      setEmailHasError(false);
      setPasswordHasError(false);
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
          theme={colors === "light" ? stdTheme : drkTheme}
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
          theme={colors === "light" ? stdTheme : drkTheme}
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
      <PaperButton
        theme={colors === "light" ? stdTheme : drkTheme}
        style={{ width: "100%" }}
        icon=""
        mode="contained"
        onPress={loginUser}
        loading={isLoginLoading}>
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
