import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import colors from "@/data/styling/colors";

const TransactionLayout = () => {
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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Add Transaction",
        }}
      />
    </Stack>
  );
};

export default TransactionLayout;

const styles = StyleSheet.create({});
