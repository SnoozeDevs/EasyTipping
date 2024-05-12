import auth from "@react-native-firebase/auth";

export const signOutUser = () => {
  auth().signOut()
};
