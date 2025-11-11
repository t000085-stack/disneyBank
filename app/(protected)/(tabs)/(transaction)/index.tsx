import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import colors from "@/data/styling/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { createTransaction } from "@/api/bank";
import { TransactionType } from "@/types/BankTypes";
import { useRouter } from "expo-router";

const AddTransaction = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const navigate = useRouter();

  const { mutate } = useMutation({
    mutationFn: (transaction: TransactionType) =>
      createTransaction(transaction),
    onError: (err) => {
      console.log(err);
      Alert.alert(
        "Error",
        "Something went wrong while saving your transaction"
      );
    },
    onSuccess: () => {
      Alert.alert("Success", "Transaction added successfully!");
      navigate.push("/(protected)/(tabs)/(home)");
    },
  });

  const handleAddTransaction = () => {
    if (!title || !amount || !date || !accountId) {
      Alert.alert("Missing info", "Please fill in all fields");
      return;
    }

    mutate({
      _id: "",
      title,
      amount: parseFloat(amount),
      date,
      accountId,
    });
  };

  return (
    <>
      {/* @ts-ignore - React 19 compatibility issue with React Native types */}
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.heading}>Add Transaction</Text>
            <Text style={styles.subText}>
              Record a new deposit or withdrawal
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Transaction title (e.g., Deposit, Candy purchase)"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount (e.g., 10 or -5)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Account ID (e.g., 1)"
              value={accountId}
              onChangeText={setAccountId}
            />

            {/* @ts-ignore - React 19 compatibility issue with React Native types */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.submitText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  subText: {
    color: "#6b7280",
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
