import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Stack } from "expo-router";
import colors from "@/data/styling/colors";
import { AntDesign } from "@expo/vector-icons";
import AuthContext from "@/context/AuthContext";
import { deleteToken } from "@/api/Storage";
import { useQueryClient } from "@tanstack/react-query";

const UserLayout = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const LogoutButton = () => (
    <View>
      {/* @ts-ignore - React 19 compatibility issue with React Native types */}
      <TouchableOpacity
        onPress={async () => {
          await deleteToken();
          queryClient.clear();
          setIsAuthenticated(false);
        }}
      >
        <AntDesign name="logout" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header - tabs handle navigation
        headerStyle: {
          backgroundColor: "#01147C",
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
          title: "",
          headerShown: true, // Explicitly hide header for tab screens
          headerRight: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
};

export default UserLayout;

const styles = StyleSheet.create({});
