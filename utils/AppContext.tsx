import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { TUserRecord } from "./types";
import { getUserDetails } from "./utils";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const AppContext = createContext<any>(null);

export type UserProviderType = {
  userValue: TUserRecord | null;
  userSetter: (userObject: any) => void;
};

type Props = {
  children?: ReactNode;
};

export function useActiveUser() {
  return useContext(AppContext);
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<TUserRecord | null>(null);

  useEffect(() => {
    getUserDetails(auth().currentUser?.uid!, setUser);
  }, []);

  const updateUser = (userObject: TUserRecord) => {
    setUser(userObject);
  };

  const userData: UserProviderType = {
    userValue: user,
    userSetter: updateUser,
  };

  return <AppContext.Provider value={userData}>{children}</AppContext.Provider>;
}

//* Realtime Listeners
export const baseUserListener = (
  user: TUserRecord,
  setUser: Dispatch<SetStateAction<TUserRecord>> | any
) => {
  const userDocRef = firestore()
    .collection("users")
    .doc(auth().currentUser?.uid!);

  if (auth().currentUser) {
    const unsubscribeFirestore = userDocRef.onSnapshot(
      async (snapshot) => {
        //* Gets users top level data
        const data = snapshot.data() as Partial<TUserRecord>;

        user &&
          setUser({
            ...(user as TUserRecord),
            email: data.email!,
            displayName: data.displayName!,
            userID: data.userID!,
          });
      },
      (error) => console.error(error)
    );

    return () => unsubscribeFirestore();
  }
};
