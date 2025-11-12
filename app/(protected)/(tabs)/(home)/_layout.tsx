import colors from "@/data/styling/colors";
import { Stack } from "expo-router";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { deleteToken } from "@/api/Storage";
import { AntDesign } from "@expo/vector-icons";
import AuthContext from "@/context/AuthContext";

const HomeLayout = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
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
          title: "Home",
          headerRight: () => (
            <View>
              {/* @ts-ignore - React 19 compatibility issue with React Native types */}
              <TouchableOpacity
                onPress={async () => {
                  await deleteToken();
                  setIsAuthenticated(false);
                }}
              >
                <AntDesign name="logout" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="deposit"
        options={{
          title: "Deposit Money",
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen name="userId" options={{ title: "User Transactions" }} />
    </Stack>
  );
};

export default HomeLayout;
