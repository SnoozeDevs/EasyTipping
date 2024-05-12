import { Text, View } from "react-native";
import React from "react";
import { UserProviderType, useGlobalContext } from "@/utils/AppContext";
import Button from "@/components/Button/Button";

export default function ModalScreen() {
  const { userValue, userSetter }: UserProviderType = useGlobalContext();

  return (
    <View>
      <Text>Selected League</Text>
      <Button
        title="AFL"
        onPress={() => {
          userSetter({
            ...userValue!,
            selectedLeague: "afl",
          });
        }}
      />
      <Button
        title="Somn else"
        onPress={() => {
          userSetter({
            ...userValue!,
            selectedLeague: "something else",
          });
        }}
      />
    </View>
  );
}
