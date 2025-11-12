import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import colors from "@/data/styling/colors";
import UserProfileCard from "@/components/UserProfileCard";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/src/api/authApi";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const Users = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Add error logging
  useEffect(() => {
    if (error) {
      console.error("❌ Error loading users:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      if ((error as any)?.response) {
        console.error("Response status:", (error as any).response.status);
        console.error("Response data:", (error as any).response.data);
      }
    }
    if (users) {
      console.log("✅ Users loaded:", users?.length || 0, "users");
      console.log("Users data:", users);
    }
  }, [error, users]);

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={{ color: colors.white, marginTop: 10 }}>
            Loading users...
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    const errorMessage =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Error loading users. Please try again.";

    return (
      <LinearGradient
        colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <AntDesign name="exclamation-circle" size={50} color={colors.white} />
          <Text
            style={{
              color: colors.white,
              fontSize: 18,
              textAlign: "center",
              marginTop: 15,
              fontWeight: "bold",
            }}
          >
            Error loading users
          </Text>
          <Text
            style={{
              color: "#E0F6FF",
              fontSize: 14,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {errorMessage}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👥 All Users</Text>
          <Text style={styles.headerSubtitle}>
            {users?.length || 0} user{users?.length !== 1 ? "s" : ""} found
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {users && Array.isArray(users) && users.length > 0 ? (
            users.map((user: any) => (
              <UserProfileCard
                key={user._id || user.email || Math.random()}
                imageUrl={
                  user.imageUrl ||
                  user.image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                email={user.email || "No email"}
                username={user.name || user.username || "User"}
                userId={user._id}
                balance={user.balance}
                accountNumber={user.accountNumber}
                accountType={user.accountType || user.type}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <AntDesign name="inbox" size={50} color={colors.white} />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Users;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0F6FF",
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.8,
    marginTop: 10,
  },
});
