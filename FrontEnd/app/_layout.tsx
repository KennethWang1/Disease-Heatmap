import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router"; // 👈 usePathname here
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import Nav from "@/components/Nav";
import { Auth0Provider } from "react-native-auth0";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname(); // 👈

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  // 👇 Define which routes should show nav
  const showNav = true;

  // ["/", "/survey", "/account"].includes(pathname)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          }}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
            {showNav && (
              <Nav
                active={
                  pathname === "/"
                    ? "home"
                    : pathname === "/survey" || pathname === "/account"
                    ? "account"
                    : "home"
                }
              />
            )}
          </ThemeProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
