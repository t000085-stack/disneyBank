import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import colors from "@/data/styling/colors";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserTransaction } from "@/api/transaction";
import { TransactionType } from "@/types/BankTypes";

const UserTransaction = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userTransactions", userId],
    queryFn: () => getUserTransaction(userId || ""),
    enabled: !!userId,
  });

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

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary,
          padding: 20,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 16 }}>
          Error loading transactions
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        padding: 20,
      }}
    >
      <Text
        style={{
          color: colors.white,
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        User Transactions
      </Text>

      <ScrollView>
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction: TransactionType) => (
            <View
              key={transaction._id}
              style={{
                backgroundColor: colors.secondary,
                padding: 15,
                borderRadius: 12,
                marginBottom: 15,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                {transaction.title}
              </Text>
              <Text
                style={{
                  color: transaction.amount < 0 ? "#ff6b6b" : "#51cf66",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 5,
                }}
              >
                {transaction.amount < 0 ? "-" : "+"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </Text>
              <Text style={{ color: colors.white, opacity: 0.8, fontSize: 14 }}>
                📅 {transaction.date}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={{
              backgroundColor: colors.secondary,
              padding: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.white, fontSize: 16 }}>
              No transactions found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default UserTransaction;

const styles = StyleSheet.create({});
