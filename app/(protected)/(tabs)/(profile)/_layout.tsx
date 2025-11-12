import { Stack } from "expo-router";
import React from "react";
import colors from "@/data/styling/colors";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          color: colors.white,
        },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Profile",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
