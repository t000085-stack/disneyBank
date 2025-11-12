import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import AuthContext from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import colors from "@/data/styling/colors";
import { getToken } from "@/api/Storage";
import { UserProvider } from "@/src/context/UserContext";

const RootLayout = () => {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkToken();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <UserProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(protected)" />
          </Stack>
        </UserProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default RootLayout;
