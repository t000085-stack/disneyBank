import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Platform,
} from "react-native";
import React, { useEffect, useRef } from "react";
import colors from "@/data/styling/colors";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/bank";
import { getMyTransactions } from "@/src/api/transactionsApi";
import { AccountType } from "@/types/BankTypes";
import { Transaction } from "@/src/types/transaction";
import AccountCard from "@/components/AccountCard";
import { useUser } from "@/src/context/UserContext";
import { formatCurrency } from "@/src/utils/currencyFormat";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const { balance, isLoading: userLoading } = useUser();
  const router = useRouter();

  // Animated values for glitter effect
  const depositGlitter = useRef(new Animated.Value(0)).current;
  const withdrawGlitter = useRef(new Animated.Value(0)).current;
  const transactionsGlitter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate deposit glitter
    const depositAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(depositGlitter, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(depositGlitter, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    depositAnimation.start();

    // Animate withdraw glitter
    const withdrawAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(withdrawGlitter, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(withdrawGlitter, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    withdrawAnimation.start();

    // Animate transactions glitter
    const transactionsAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(transactionsGlitter, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(transactionsGlitter, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    transactionsAnimation.start();
  }, []);
  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
    retry: 1,
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: getMyTransactions,
    retry: 1,
  });

  const isLoading = accountsLoading || transactionsLoading;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent" }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNTS SECTION */}
        <View
          style={{
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: colors.white,
            }}
          >
            🏦 My Accounts
          </Text>
        </View>
        {Array.isArray(accounts) && accounts.length > 0 ? (
          accounts.map((account: AccountType) => (
            <AccountCard
              key={account._id}
              imageUrl={
                account.imageUrl ||
                "https://avatarfiles.alphacoders.com/656/thumb-1920-65656.png"
              }
              name={account.name}
              balance={account.balance}
              accountId={account._id}
            />
          ))
        ) : (
          <View
            style={{
              marginBottom: 20,
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#FFD700", // Yellow border
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 8,
                },
              }),
            }}
          >
            <Image
              source={require("@/src/assets/images/background.jpeg")}
              style={{
                width: "100%",
                height: 200,
                opacity: 0.9,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                padding: 24,
                justifyContent: "space-between",
                backgroundColor: "rgba(1, 19, 124, 0.59)",
              }}
            >
              {/* Top Section - Chip and Logo */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 30,
                    backgroundColor: "rgba(255, 215, 0, 0.3)",
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "rgba(255, 215, 0, 0.5)",
                  }}
                />
                <AntDesign name="credit-card" size={32} color={colors.white} />
              </View>

              {/* Middle Section - Balance */}
              <View>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: 12,
                    fontWeight: "500",
                    marginBottom: 8,
                    letterSpacing: 1,
                  }}
                >
                  ACCOUNT BALANCE
                </Text>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 36,
                    fontWeight: "bold",
                    letterSpacing: 1,
                  }}
                >
                  {userLoading ? "Loading..." : formatCurrency(balance)}
                </Text>
              </View>

              {/* Bottom Section - Card Details */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: 10,
                      marginBottom: 4,
                      letterSpacing: 1,
                    }}
                  >
                    CARDHOLDER
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 14,
                      fontWeight: "600",
                      letterSpacing: 0.5,
                    }}
                  >
                    DISNEY BANK
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: 10,
                      marginBottom: 4,
                      letterSpacing: 1,
                    }}
                  >
                    VALID
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    ∞
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Deposit, Withdraw, and All Transactions Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            paddingHorizontal: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(protected)/(tabs)/(home)/deposit")}
            style={{
              backgroundColor: "transparent",
              borderRadius: 16,
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginRight: 3,
            }}
          >
            <Animated.View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 6,
                borderWidth: 1,
                borderColor: depositGlitter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    "rgba(255, 215, 0, 0.8)",
                    "rgba(255, 255, 255, 1)",
                  ],
                }),
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: depositGlitter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
                shadowRadius: 15,
                elevation: 15,
                overflow: "hidden",
              }}
            >
              <Image
                source={require("@/src/assets/images/deposit.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 40,
                }}
              />
            </Animated.View>
            <Text
              style={{
                color: colors.white,
                fontWeight: "bold",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Deposit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(protected)/(tabs)/(home)/withdraw")}
            style={{
              backgroundColor: "transparent",
              borderRadius: 16,
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginHorizontal: 3,
            }}
          >
            <Animated.View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 6,
                borderWidth: 3,
                borderColor: withdrawGlitter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    "rgba(255, 215, 0, 0.8)",
                    "rgba(255, 255, 255, 1)",
                  ],
                }),
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: withdrawGlitter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
                shadowRadius: 15,
                elevation: 15,
                overflow: "hidden",
              }}
            >
              <Image
                source={require("@/src/assets/images/sad.jpeg")}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 40,
                }}
              />
            </Animated.View>
            <Text
              style={{
                color: colors.white,
                fontWeight: "bold",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Withdraw
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push("/(protected)/(tabs)/(home)/allTransactions")
            }
            style={{
              backgroundColor: "transparent",
              borderRadius: 16,
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginLeft: 3,
            }}
          >
            <Animated.View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 6,
                borderWidth: 3,
                borderColor: transactionsGlitter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    "rgba(255, 215, 0, 0.8)",
                    "rgba(255, 255, 255, 1)",
                  ],
                }),
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: transactionsGlitter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
                shadowRadius: 15,
                elevation: 15,
                overflow: "hidden",
              }}
            >
              <Image
                source={require("@/src/assets/images/transaction.jpeg")}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 40,
                }}
              />
            </Animated.View>
            <Text
              style={{
                color: colors.white,
                fontWeight: "bold",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* RECENT TRANSACTIONS SECTION */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: colors.white,
            marginBottom: 15,
            marginTop: 20,
          }}
        >
          💰 Recent Transactions
        </Text>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.slice(0, 5).map((transaction: Transaction) => (
            <View
              key={transaction._id}
              style={{
                backgroundColor: colors.secondary,
                padding: 15,
                borderRadius: 12,
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  {transaction.type?.charAt(0).toUpperCase() +
                    transaction.type?.slice(1) || "Transaction"}
                </Text>
                <Text
                  style={{ color: colors.white, opacity: 0.7, fontSize: 12 }}
                >
                  📅 {transaction.date}
                </Text>
                {transaction.username && (
                  <Text
                    style={{ color: colors.white, opacity: 0.7, fontSize: 12 }}
                  >
                    {transaction.type === "Transfer"
                      ? `To: ${transaction.username}`
                      : transaction.username}
                  </Text>
                )}
              </View>
              <Text
                style={{
                  color:
                    transaction.type?.toLowerCase() === "deposit"
                      ? "#51cf66"
                      : "#ff6b6b",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {transaction.type?.toLowerCase() === "deposit" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={{
              backgroundColor: colors.secondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.white, fontSize: 16 }}>
              No transactions found
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({});
