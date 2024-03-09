import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getUserDetails } from "./utils";
import { TUserRecord } from "@/components/CustomDrawer";
import firestore from "@react-native-firebase/firestore";

export function useCurrentUser() {
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
