import { DrawerToggleButton } from "@react-navigation/drawer";
import { View, Text } from "react-native";

export default function Settings() {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 1000,
      }}>
      <Text>This is the settings page</Text>
    </View>
  );
}
