import { IButtonProps } from "./Button.types";
import * as S from "./Button.styles";
import { Text } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { stdTheme } from "@/themes/stdTheme";
import { drkTheme } from "@/themes/drkTheme";

const Button = ({
  title,
  iconName,
  iconPosition = "right",
  onPress,
  dark,
  loading,
  compact,
  disabled,
  theme = "standard",
  mode = "contained",
  fullWidth,
  style,
  labelStyle,
}: IButtonProps) => {
  //* For icon options, see: https://callstack.github.io/react-native-paper/docs/guides/icons/#1-an-icon-name

  return (
    <S.Button
      style={fullWidth ? { ...style, width: "100%" } : style}
      labelStyle={labelStyle}
      contentStyle={{
        flexDirection: `${iconPosition === "right" ? "row-reverse" : "row"}`,
      }}
      icon={iconName}
      mode={mode}
      theme={theme === "standard" ? stdTheme : drkTheme}
      onPress={onPress}
      dark={dark}
      loading={loading}
      compact={compact}
      disabled={disabled}>
      {title}
    </S.Button>
  );
};

export default Button;
