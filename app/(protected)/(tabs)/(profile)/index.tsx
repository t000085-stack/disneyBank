import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/data/styling/colors";
import { useUser } from "@/src/context/UserContext";
import { formatCurrency } from "@/src/utils/currencyFormat";
import { AntDesign } from "@expo/vector-icons";

/**
 * Profile Page
 * Displays user profile information fetched from /mini-project/api/auth/me
 */
const ProfilePage = () => {
  const { user, balance, isLoading, refreshProfile } = useUser();

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>👤 My Profile</Text>
            <Text style={styles.subtitle}>Your account information</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <AntDesign name="user" size={50} color={colors.primary} />
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user?.username || "N/A"}</Text>
              </View>

              {user?.name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
              )}

              {user?.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Balance</Text>
                <Text style={[styles.infoValue, styles.balanceValue]}>
                  {formatCurrency(balance)}
                </Text>
              </View>

              {user?._id && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User ID</Text>
                  <Text style={[styles.infoValue, styles.userIdValue]}>
                    {user._id}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>💰 Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>

          {/* Refresh Button */}
          <View style={styles.refreshContainer}>
            <Text style={styles.refreshHint}>
              Pull down to refresh your profile
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0F6FF",
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.lightBlue,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.primary,
  },
  infoSection: {
    width: "100%",
    gap: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  userIdValue: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
  },
  balanceCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 1,
  },
  refreshContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  refreshHint: {
    fontSize: 12,
    color: "#E0F6FF",
    opacity: 0.7,
  },
});

export default ProfilePage;
