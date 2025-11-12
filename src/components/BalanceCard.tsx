import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/data/styling/colors";
import { formatCurrency } from "@/src/utils/currencyFormat";

interface BalanceCardProps {
  balance: number;
  userName?: string;
  userImage?: string;
}

/**
 * BalanceCard Component
 * Displays user's profile (avatar + name) and account balance
 * with Disney-themed gradient styling
 */
const BalanceCard = ({ balance, userName, userImage }: BalanceCardProps) => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.persianBlue, colors.deepBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* User Profile Section */}
      <View style={styles.header}>
        {userImage && (
          <Image source={{ uri: userImage }} style={styles.avatar} />
        )}
        {userName && <Text style={styles.userName}>{userName}</Text>}
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Account Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.white,
    marginRight: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  balanceContainer: {
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.lightBlue,
    marginBottom: 8,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 1,
  },
});

export default BalanceCard;
