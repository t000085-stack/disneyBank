import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import colors from "@/data/styling/colors";
import { withdraw } from "@/src/api/transactionsApi";
import { useUser } from "@/src/context/UserContext";
import { formatCurrency } from "@/src/utils/currencyFormat";

/**
 * Withdraw Page
 * Allows users to withdraw money from their account
 * Uses PUT /mini-project/api/transactions/withdraw
 */
const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { balance, updateBalance, refreshProfile } = useUser();

  const withdrawMutation = useMutation({
    mutationFn: withdraw,
    onSuccess: async (data) => {
      // Update balance in context
      updateBalance(data.balance);
      // Refresh profile to get latest data
      await refreshProfile();
      // Refetch transactions immediately to ensure fresh data
      await queryClient.refetchQueries({ queryKey: ["myTransactions"] });

      Alert.alert(
        "Success",
        `Withdrawal of ${formatCurrency(parseFloat(amount))} successful! 💸`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
      setAmount("");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to withdraw money. Please try again.";
      Alert.alert("Error", errorMessage);
    },
  });

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);

    // Validation
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount greater than 0");
      return;
    }

    if (withdrawAmount > balance) {
      Alert.alert(
        "Error",
        "Insufficient balance. You don't have enough funds."
      );
      return;
    }

    // Call the withdraw API - PUT /mini-project/api/transactions/withdraw
    withdrawMutation.mutate({ amount: withdrawAmount });
  };

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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <AntDesign name="arrow-left" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Withdraw Money</Text>
            <Text style={styles.subtitle}>
              Withdraw funds from your account
            </Text>
          </View>

          {/* Current Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>

          {/* Withdraw Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Withdraw Amount</Text>
            <Text style={styles.formSubtitle}>
              Enter the amount you want to withdraw
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
                autoFocus
              />
            </View>

            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>You will withdraw:</Text>
                <Text style={styles.previewAmount}>
                  {formatCurrency(parseFloat(amount))}
                </Text>
                <Text style={styles.previewNewBalance}>
                  New balance: {formatCurrency(balance - parseFloat(amount))}
                </Text>
                {parseFloat(amount) > balance && (
                  <Text style={styles.errorText}>⚠️ Insufficient balance</Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                (withdrawMutation.isPending || parseFloat(amount) > balance) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleWithdraw}
              disabled={
                withdrawMutation.isPending || parseFloat(amount) > balance
              }
            >
              {withdrawMutation.isPending ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Withdraw Money</Text>
                  <AntDesign
                    name="minus-circle"
                    size={20}
                    color={colors.white}
                    style={styles.submitIcon}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Section */}
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
  header: {
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
  balanceCard: {
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
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
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
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 12,
    padding: 18,
    fontSize: 20,
    backgroundColor: "#f9fafb",
    fontWeight: "600",
    color: colors.secondary,
  },
  previewCard: {
    backgroundColor: colors.lightBlue,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  previewAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  previewNewBalance: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "600",
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  submitIcon: {
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#E0F6FF",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default WithdrawPage;
