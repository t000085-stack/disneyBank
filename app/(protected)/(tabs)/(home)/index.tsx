import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
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

const Home = () => {
  const { balance, isLoading: userLoading } = useUser();
  const router = useRouter();
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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.primary }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ACCOUNTS SECTION */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(tabs)/(home)/deposit")}
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AntDesign name="plus" size={16} color={colors.primary} />
          <Text
            style={{
              color: colors.primary,
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Deposit
          </Text>
        </TouchableOpacity>
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
            backgroundColor: colors.secondary,
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            alignItems: "center",
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
            Account Balance
          </Text>
          <Text
            style={{ color: colors.white, fontSize: 24, fontWeight: "bold" }}
          >
            {userLoading ? "Loading..." : formatCurrency(balance)}
          </Text>
          <Text
            style={{
              color: colors.white,
              fontSize: 14,
              marginTop: 8,
              opacity: 0.8,
            }}
          ></Text>
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
                {transaction.type || transaction.description || "Transaction"}
              </Text>
              <Text style={{ color: colors.white, opacity: 0.7, fontSize: 12 }}>
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
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
