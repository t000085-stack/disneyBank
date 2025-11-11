import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import colors from "@/data/styling/colors";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts, getAllTransactions, getAllGoals } from "@/api/bank";
import { AccountType, TransactionType, GoalType } from "@/types/BankTypes";
import AccountCard from "@/components/AccountCard";

const Home = () => {
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
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
    retry: 1,
  });

  const {
    data: goals,
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: getAllGoals,
    retry: 1,
  });

  const isLoading = accountsLoading || transactionsLoading || goalsLoading;

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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.primary }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ACCOUNTS SECTION */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: colors.white,
          marginBottom: 15,
          marginTop: 10,
        }}
      >
        🏦 My Accounts
      </Text>
      {accountsError ? (
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
            Error loading accounts
          </Text>
        </View>
      ) : Array.isArray(accounts) && accounts.length > 0 ? (
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
            backgroundColor: colors.secondary,
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.white, fontSize: 16 }}>
            No accounts found
          </Text>
        </View>
      )}

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
      {transactionsError ? (
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
            Error loading transactions
          </Text>
        </View>
      ) : Array.isArray(transactions) && transactions.length > 0 ? (
        transactions.slice(0, 5).map((transaction: TransactionType) => (
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
                {transaction.title}
              </Text>
              <Text style={{ color: colors.white, opacity: 0.7, fontSize: 12 }}>
                📅 {transaction.date}
              </Text>
            </View>
            <Text
              style={{
                color: transaction.amount < 0 ? "#ff6b6b" : "#51cf66",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {transaction.amount < 0 ? "-" : "+"}$
              {Math.abs(transaction.amount).toFixed(2)}
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

      {/* SAVING GOALS SECTION */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: colors.white,
          marginBottom: 15,
          marginTop: 20,
        }}
      >
        🎯 Saving Goals
      </Text>
      {goalsError ? (
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
            Error loading goals
          </Text>
        </View>
      ) : Array.isArray(goals) && goals.length > 0 ? (
        goals.map((goal: GoalType) => {
          const progress = (goal.saved / goal.target) * 100;
          return (
            <View
              key={goal._id}
              style={{
                backgroundColor: colors.secondary,
                padding: 15,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                {goal.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: colors.white, fontSize: 14 }}>
                  ${goal.saved.toFixed(2)} / ${goal.target.toFixed(2)}
                </Text>
                <Text style={{ color: colors.white, fontSize: 14 }}>
                  {progress.toFixed(0)}%
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: "#51cf66",
                  }}
                />
              </View>
            </View>
          );
        })
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
            No saving goals found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
