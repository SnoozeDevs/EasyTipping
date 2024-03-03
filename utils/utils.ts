import firestore from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";

export const isEmailValid = (email: string) => {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return validRegex.test(email)
}

export const getLadder = async (setTeamData: Dispatch<SetStateAction<Array<string>>>, setIsTeamDataLoaded: Dispatch<SetStateAction<boolean>>) => {
  await firestore()
    .collection("standings")
    .doc("2023")
    .get()
    .then((res: any) => {
      setTeamData(res._data.ladder);
      setIsTeamDataLoaded(true);
    });
};

export const signOutUser = () => {
  auth()
    .signOut()
    .then(async () => {
      router.navigate("login");
      console.log("user signed out");
    });
};