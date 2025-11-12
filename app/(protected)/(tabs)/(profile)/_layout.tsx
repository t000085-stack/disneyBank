import { Stack } from "expo-router";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import colors from "@/data/styling/colors";
import { AntDesign } from "@expo/vector-icons";
import AuthContext from "@/context/AuthContext";
import { deleteToken } from "@/api/Storage";
import { useQueryClient } from "@tanstack/react-query";

const ProfileLayout = () => {
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
        headerShown: true,
        headerStyle: {
          backgroundColor: "#01147C",
        },
        headerTitleStyle: {
          color: colors.white,
        },
        headerTintColor: colors.white,
        headerRight: () => <LogoutButton />,
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
