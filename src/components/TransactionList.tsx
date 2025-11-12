import React from "react";
import { View, Text, StyleSheet, FlatList, Platform } from "react-native";
import colors from "@/data/styling/colors";
import { Transaction, TransactionType } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/currencyFormat";

interface TransactionListProps {
  transactions: Transaction[];
}

/**
 * TransactionList Component
 * Displays a list of transactions with icons, colors, and formatted amounts
 */
const TransactionList = ({ transactions }: TransactionListProps) => {
  /**
   * Returns an emoji icon based on transaction type
   */
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case TransactionType.Deposit:
        return "💰";
      case TransactionType.Withdraw:
        return "💸";
      case TransactionType.Transfer:
        return "🔄";
      default:
        return "💳";
    }
  };

  /**
   * Returns a color based on transaction type
   * Green for deposits, Red for withdrawals, Blue for transfers
   */
  const getTransactionColor = (type: string, amount: number) => {
    if (type === TransactionType.Deposit) {
      return "#51cf66"; // Green
    } else if (type === TransactionType.Withdraw) {
      return "#ff6b6b"; // Red
    } else {
      return "#4dabf7"; // Blue for transfers
    }
  };

  /**
   * Formats date string to a readable format
   */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Renders a single transaction item
   */
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const icon = getTransactionIcon(item.type);
    const color = getTransactionColor(item.type, item.amount);
    const isPositive = item.type === TransactionType.Deposit;

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Transaction Info */}
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionType}>{item.type}</Text>
            {item.username && (
              <Text style={styles.username}>
                {item.type === TransactionType.Transfer
                  ? `To: ${item.username}`
                  : item.username}
              </Text>
            )}
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>

          {/* Amount and Date */}
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color }]}>
              {isPositive ? "+" : "-"}
              {formatCurrency(Math.abs(item.amount))}
            </Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Empty state
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions yet</Text>
        <Text style={styles.emptySubtext}>
          Your transaction history will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
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
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 4,
  },
  username: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#9ca3af",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: "#9ca3af",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default TransactionList;
