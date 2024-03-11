import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getUserDetails } from "./utils";
import firestore from "@react-native-firebase/firestore";
import { TUserRecord } from "./types";

export function useCurrentUser() {
  //TODO build in listeners for all user changes in the db.
  const [user, setUser] = useState<TUserRecord | null>(null);

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
      const unsubscribeFirestore = firestore()
        .collection("users")
        .doc(auth().currentUser?.uid!)
        .onSnapshot(
          (snapshot) => {
            //TODO update user record type.
            const data = snapshot.data() as TUserRecord;
            setUser(data);
          },
          (error) => console.error(error)
        );

      return () => unsubscribeFirestore();
    }
  }, [auth().currentUser]);

  return user;
}
