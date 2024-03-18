import { useState, useEffect, SetStateAction } from "react";
import auth from "@react-native-firebase/auth";
import { destructureGroupData, getUserDetails } from "./utils";
import firestore from "@react-native-firebase/firestore";
import { TUserRecord } from "./types";

export function useCurrentUser() {
  const [user, setUser] = useState<TUserRecord | null>(null);
  const userDocRef = firestore()
    .collection("users")
    .doc(auth().currentUser?.uid!);

  //* Update user if they are authorised, clear user if not.
  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        getUserDetails(currentUser.uid, setUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, [auth().currentUser]);

  //* Update user record as soon as value is updated in Firestore Database
  useEffect(() => {
    //* Check if user is authenticate to listen for DB changes.
    if (auth().currentUser) {
      const unsubscribeFirestore = userDocRef.onSnapshot(
        async (snapshot) => {
          //* Gets users top level data
          const data = snapshot.data() as Partial<TUserRecord>;

          //* Grabs group collection data from user
          const groupObject = await destructureGroupData();

          setUser({
            email: data.email!,
            displayName: data.displayName!,
            userID: data.userID!,
            groups: groupObject,
          });
        },
        (error) => console.error(error)
      );

      return () => unsubscribeFirestore();
    }
  }, [auth().currentUser]);

  return user;
}
