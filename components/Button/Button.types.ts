import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Theme } from "@react-navigation/native";
import { Animated, StyleProp, TextStyle, ViewStyle } from "react-native";

export interface IButtonProps {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  title: string;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  dark?: boolean
  loading?: boolean
  compact?: boolean
  disabled?: boolean;
  theme?: 'standard' | 'dark';
  fullWidth?: boolean;
  labelStyle?: StyleProp<TextStyle>
}