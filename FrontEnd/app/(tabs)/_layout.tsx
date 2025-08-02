import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeIcon from "@/assets/svg-icons/HomeIcon";
import AccIcon from "@/assets/svg-icons/AccIcon";
import SurveyIcon from "@/assets/svg-icons/SurveryIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#76EAFF", // ✅ your custom active color
        tabBarInactiveTintColor: "#AAAAAA", // ✅ your custom inactive color
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            alignSelf: "center",
            height: scaleHeight(64),
            width: scaleWidth(246),
            borderRadius: 40,
            backgroundColor: "#23272A",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: scaleHeight(10),
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="survey"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <SurveyIcon color={color} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <AccIcon color={color} width={size} height={size} />
          ),
        }}
      />
    </Tabs>
  );
}
