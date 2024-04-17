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
import { destructureGroupData, getUserDetails } from "./utils";
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
    getUserDetails(auth().currentUser?.uid!, user!, setUser);
  }, [auth().currentUser]);

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
            selectedLeague: data.selectedLeague ?? "",
          });
      },
      (error) => console.error(error)
    );

    return () => unsubscribeFirestore();
  }
};

export const tipUpdateListener = (
  user: TUserRecord,
  setUser: Dispatch<SetStateAction<TUserRecord>> | any,
  selectedGroup: any,
  selectedRound: string
) => {
  const userDocRef = firestore()
    .collection("users")
    .doc(auth().currentUser?.uid!);
  const userGroupsCollectionRef = userDocRef.collection("groups");
  const selectedGroupTipRef = userGroupsCollectionRef
    .doc(selectedGroup)
    .collection("tips")
    .doc(selectedRound);

  const unsubscribeFirestore = selectedGroupTipRef.onSnapshot(
    async (snapshot: any) => {
      user &&
        setUser({
          ...(user as TUserRecord),
          groups: {
            ...user.groups,
            [selectedGroup]: {
              ...user.groups[selectedGroup],
              tips: {
                ...user.groups[selectedGroup].tips,
                [selectedRound]: snapshot.data(),
              },
            },
          },
        });
    },
    (error) => console.error(error)
  );

  return () => unsubscribeFirestore();
};

export const groupUpdateListener = async (
  user: TUserRecord,
  setUser: Dispatch<SetStateAction<TUserRecord>> | any,
  selectedLeague: string
) => {
  const userDocRef = firestore()
    .collection("users")
    .doc(auth().currentUser?.uid!);
  const userGroupsCollectionRef = userDocRef.collection("groups");

  const unsubscribeFirestore = userGroupsCollectionRef.onSnapshot(
    async (snapshot: any) => {
      //* Grabs group collection data from user
      //TODO remove the generic update from both the groups and tip listener, and only
      // todo update the object key.
      const groupObject = await destructureGroupData();

      user &&
        setUser({
          ...(user as TUserRecord),
          groups: groupObject,
          selectedLeague: selectedLeague,
        });
    },
    (error) => console.error(error)
  );

  return () => unsubscribeFirestore();
};
