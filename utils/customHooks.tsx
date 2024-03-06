import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getUserDetails } from "./utils";
import { TUserRecord } from "@/components/CustomDrawer";
import firestore from "@react-native-firebase/firestore";

export function useCurrentUser() {
  //TODO move user type to shared typeface
  //TODO fixed log out firestore permission error.
  const [user, setUser] = useState<TUserRecord>();

  useEffect(() => {
    getUserDetails(auth().currentUser?.uid!, setUser);
  }, [auth().currentUser]);

  useEffect(() => {
    if (auth().currentUser) {
      const userRecordChange = firestore()
        .collection("users")
        .doc(auth().currentUser?.uid!)
        .onSnapshot(
          (snapshot) => {
            const data = snapshot.data() as TUserRecord;
            setUser(data);
          },
          (error) => console.error(error)
        );
      return () => userRecordChange();
    }
  }, []);

  return user;
}
