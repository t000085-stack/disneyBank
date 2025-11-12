import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import colors from "@/data/styling/colors";
import { AccountType, AccountTypeEnum } from "@/types/BankTypes";
import { formatCurrency, maskAccountNumber } from "@/src/utils/currencyFormat";

interface AccountCardProps {
  account: AccountType;
  onPress?: () => void;
}

const AccountCard = ({ account, onPress }: AccountCardProps) => {
  const getTypeColor = (type?: AccountTypeEnum) => {
    switch (type) {
      case AccountTypeEnum.Checking:
        return "#4A90E2"; // Blue
      case AccountTypeEnum.Savings:
        return "#50C878"; // Green
      case AccountTypeEnum.Rewards:
        return "#FFD700"; // Gold
      default:
        return colors.primary;
    }
  };

  const getTypeIcon = (type?: AccountTypeEnum) => {
    switch (type) {
      case AccountTypeEnum.Checking:
        return "💳";
      case AccountTypeEnum.Savings:
        return "💰";
      case AccountTypeEnum.Rewards:
        return "⭐";
      default:
        return "🏦";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getTypeColor(account.type) }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>{getTypeIcon(account.type)}</Text>
          <View>
            <Text style={styles.name}>{account.name}</Text>
            {account.type && <Text style={styles.type}>{account.type}</Text>}
          </View>
        </View>
        <Text style={styles.balance}>{formatCurrency(account.balance)}</Text>
      </View>
      {account.accountNumber && (
        <View style={styles.accountNumberContainer}>
          <Text style={styles.accountNumberLabel}>Account Number:</Text>
          <Text style={styles.accountNumber}>
            {maskAccountNumber(account.accountNumber)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  accountNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  accountNumberLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondary,
    letterSpacing: 1,
  },
});

export default AccountCard;
