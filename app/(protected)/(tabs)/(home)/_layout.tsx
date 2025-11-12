import colors from "@/data/styling/colors";
import { Stack } from "expo-router";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { deleteToken } from "@/api/Storage";
import { AntDesign } from "@expo/vector-icons";
import AuthContext from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const HomeLayout = () => {
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
        headerRight: () => <LogoutButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="deposit"
        options={{
          title: "Deposit Money",
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{
          title: "Withdraw Money",
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="allTransactions"
        options={{
          title: "All Transactions",
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen name="userId" options={{ title: "User Transactions" }} />
    </Stack>
  );
};

export default HomeLayout;
