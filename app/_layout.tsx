import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useLocalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import React from "react";
import { UserProvider } from "@/utils/AppContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          initialRouteName="(pageRoutes)/login"
          screenOptions={{
            gestureDirection: "horizontal",
            gestureEnabled: true,
            animationTypeForReplace: "push",
          }}>
          <Stack.Screen
            name="groups/[id]"
            /* @ts-ignore */
            options={({ route }) => ({
              title: `${route.params.name}`,
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            name="(pageRoutes)/login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(pageRoutes)/signup"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(pageRoutes)/modal"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="(pageRoutes)/find-group"
            options={{
              presentation: "card",
              headerBackTitle: "Back",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="(pageRoutes)/create-group"
            options={{
              presentation: "modal",
              headerBackTitle: "Back",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="(pageRoutes)/settings"
            options={{
              headerShown: true,
              headerTitle: "Settings",
              headerBackTitle: "Back",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="(pageRoutes)/profile"
            options={{
              headerShown: true,
              headerTitle: "Profile",
              headerBackTitle: "Back",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}
