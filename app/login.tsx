import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

type ITabTwoProps = {
  userEmail: string;
};

export default function Login({ userEmail }: ITabTwoProps) {
  return (
    <View style={styles.container}>
      <Text>{userEmail}</Text>
      <Link href={"/(tabs)/two"} asChild>
        <Pressable>
          <Text>Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
