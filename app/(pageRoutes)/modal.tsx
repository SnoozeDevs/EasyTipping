import { Text, View } from "react-native";
import React from "react";
import { UserProviderType, useActiveUser } from "@/utils/AppContext";
import Button from "@/components/Button/Button";

export default function ModalScreen() {
  const user: UserProviderType = useActiveUser();

  return (
    <View>
      <Text>Selected League</Text>
      <Button
        title="AFL"
        onPress={() => {
          user.userSetter({
            ...user.userValue,
            selectedLeague: "afl",
          });
        }}
      />
      <Button
        title="Somn else"
        onPress={() => {
          user.userSetter({
            ...user.userValue,
            selectedLeague: "something else",
          });
        }}
      />
    </View>
  );
}
