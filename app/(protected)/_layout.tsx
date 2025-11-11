import { Redirect } from "expo-router";
import { Stack } from "expo-router";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export default function ProtectedLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
