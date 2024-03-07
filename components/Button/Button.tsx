import { IButtonProps } from "./Button.types";
import * as S from "./Button.styles";
import { Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Button = ({
  title,
  iconName,
  iconPosition = "right",
  onPress,
}: IButtonProps) => {
  return (
    <S.Button onPress={onPress}>
      {iconPosition === "left" && <MaterialIcons name={iconName} size={25} />}
      <S.Text>{title}</S.Text>
      {iconPosition === "right" && (
        <MaterialIcons name={iconName} size={16} style={{ color: "#fff" }} />
      )}
    </S.Button>
  );
};

export default Button;
