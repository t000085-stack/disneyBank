import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import colors from "@/data/styling/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserTransaction } from "@/api/transaction";
import { TransactionType } from "@/types/BankTypes";
import { getUserById } from "@/src/api/authApi";
import { formatCurrency } from "@/src/utils/currencyFormat";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const UserTransaction = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const {
    data: userDetails,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => getUserById(userId || ""),
    enabled: !!userId,
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["userTransactions", userId],
    queryFn: () => getUserTransaction(userId || ""),
    enabled: !!userId,
    retry: false, // Don't retry on 404
  });

  const isLoading = userLoading || transactionsLoading;
  const error = userError || transactionsError;

  // Log userId and component state
  useEffect(() => {
    console.log("🔍 UserId page - userId:", userId);
    console.log("🔍 UserId page - isLoading:", isLoading);
    console.log("🔍 UserId page - error:", error);
    console.log("🔍 UserId page - userDetails:", userDetails);
    console.log("🔍 UserId page - transactions:", transactions);
  }, [userId, isLoading, error, userDetails, transactions]);

  // Log errors separately
  useEffect(() => {
    if (userError) {
      console.log("❌ Error fetching user details:", userError);
      console.log("Error details:", JSON.stringify(userError, null, 2));
      if (userError instanceof Error) {
        console.log("Error message:", userError.message);
        console.log("Error stack:", userError.stack);
      }
    }
  }, [userError]);

  useEffect(() => {
    if (transactionsError) {
      console.log("❌ Error fetching user transactions:", transactionsError);
      console.log("Error details:", JSON.stringify(transactionsError, null, 2));
    }
  }, [transactionsError]);

  // Log success
  useEffect(() => {
    if (userDetails) {
      console.log("✅ User details fetched successfully:", userDetails);
      console.log("User data keys:", Object.keys(userDetails || {}));
    }
  }, [userDetails]);

  useEffect(() => {
    if (transactions) {
      console.log("✅ User transactions fetched successfully:", transactions);
      console.log(
        "Transactions count:",
        Array.isArray(transactions) ? transactions.length : 0
      );
    }
  }, [transactions]);

  const getImageUrl = (user: any): string | null => {
    if (!user) return null;
    const imagePath =
      user.imageUrl || user.image || user.profileImage || user.avatar;
    if (!imagePath) return null;
    if (
      typeof imagePath === "string" &&
      (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    ) {
      return imagePath;
    }
    if (typeof imagePath === "string" && imagePath.startsWith("/")) {
      return `https://react-bank-project.eapi.joincoded.com${imagePath}`;
    }
    if (typeof imagePath === "string" && !imagePath.startsWith("http")) {
      const normalizedPath = imagePath.startsWith("/")
        ? imagePath
        : `/${imagePath}`;
      return `https://react-bank-project.eapi.joincoded.com${normalizedPath}`;
    }
    return imagePath;
  };

  if (isLoading) {
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
          }}
        >
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={{ color: colors.white, marginTop: 10 }}>
            Loading user details...
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
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
              fontSize: 16,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            Error loading user details. Please try again.
          </Text>
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
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={{ padding: 20 }}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrow-left" size={24} color={colors.white} />
          </TouchableOpacity>

          {/* User Profile Section */}
          {userDetails ? (
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                {getImageUrl(userDetails) ? (
                  <Image
                    source={{ uri: getImageUrl(userDetails)! }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <AntDesign name="user" size={50} color={colors.primary} />
                  </View>
                )}
              </View>

              <Text style={styles.profileName}>
                {(userDetails as any).name ||
                  (userDetails as any).username ||
                  "User"}
              </Text>
              {(userDetails as any).email && (
                <Text style={styles.profileEmail}>
                  {(userDetails as any).email}
                </Text>
              )}

              {/* Account Information */}
              <View style={styles.accountInfoSection}>
                <Text style={styles.sectionTitle}>Account Information</Text>

                {(userDetails as any).balance !== undefined &&
                  (userDetails as any).balance !== null && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>💰 Balance:</Text>
                      <Text style={styles.infoValue}>
                        {formatCurrency(
                          Number((userDetails as any).balance) || 0
                        )}
                      </Text>
                    </View>
                  )}

                {(userDetails as any).accountNumber && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🏦 Account Number:</Text>
                    <Text style={styles.infoValue}>
                      {String((userDetails as any).accountNumber)}
                    </Text>
                  </View>
                )}

                {((userDetails as any).accountType ||
                  (userDetails as any).type) && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📋 Account Type:</Text>
                    <Text style={styles.infoValue}>
                      {String(
                        (userDetails as any).accountType ||
                          (userDetails as any).type
                      )}
                    </Text>
                  </View>
                )}

                {(userDetails as any)._id && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🆔 User ID:</Text>
                    <Text style={[styles.infoValue, styles.userIdText]}>
                      {String((userDetails as any)._id)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.profileCard}>
              <Text style={styles.noDataText}>No user details available</Text>
            </View>
          )}

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <Text style={styles.transactionsTitle}>💳 Transactions</Text>
            {transactionsError && (transactionsError as any)?.status === 404 ? (
              <View style={styles.emptyTransactions}>
                <AntDesign name="info-circle" size={40} color={colors.white} />
                <Text style={styles.emptyText}>
                  Transactions are not available for other users
                </Text>
              </View>
            ) : transactionsLoading ? (
              <View style={styles.emptyTransactions}>
                <ActivityIndicator size="large" color={colors.white} />
                <Text style={styles.emptyText}>Loading transactions...</Text>
              </View>
            ) : transactions &&
              Array.isArray(transactions) &&
              transactions.length > 0 ? (
              transactions.map((transaction: TransactionType) => (
                <View key={transaction._id} style={styles.transactionCard}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: transaction.amount < 0 ? "#ff6b6b" : "#51cf66",
                      },
                    ]}
                  >
                    {transaction.title?.toLowerCase().includes("deposit") ||
                    (transaction as any).type?.toLowerCase() === "deposit"
                      ? "-"
                      : transaction.amount < 0
                      ? "-"
                      : "+"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </Text>
                  {(transaction as any).date && (
                    <Text style={styles.transactionDate}>
                      📅 {(transaction as any).date}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyTransactions}>
                <AntDesign name="inbox" size={40} color={colors.white} />
                <Text style={styles.emptyText}>No transactions found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default UserTransaction;

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 20,
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
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.lightBlue,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  accountInfoSection: {
    width: "100%",
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
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
  },
  userIdText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#9ca3af",
  },
  transactionsSection: {
    marginTop: 10,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  emptyTransactions: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: colors.white,
    marginTop: 10,
    opacity: 0.8,
  },
  noDataText: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: "center",
    padding: 20,
  },
});
