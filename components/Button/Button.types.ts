import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Theme } from "@react-navigation/native";

export interface IButtonProps {
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
}