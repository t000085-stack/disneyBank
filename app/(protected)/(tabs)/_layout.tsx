import { Tabs } from "expo-router";
import React from "react";
import colors from "@/data/styling/colors";
import { AntDesign } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightBlue,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(transaction)"
        options={{
          title: "Transaction",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <AntDesign name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(users)"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
