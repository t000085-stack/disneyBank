import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AntDesign } from "@expo/vector-icons";
import colors from "@/data/styling/colors";
import { useUser } from "@/src/context/UserContext";
import {
  getMyTransactions,
  deposit,
  withdraw,
  transfer,
} from "@/src/api/transactionsApi";
import { getAllUsers } from "@/src/api/authApi";
import { Transaction, TransactionType } from "@/src/types/transaction";
import BalanceCard from "@/src/components/BalanceCard";
import TransactionList from "@/src/components/TransactionList";

/**
 * AccountsScreen Component
 * Main screen showing user profile, balance, transactions, and action buttons
 * Includes modals for Deposit, Withdraw, and Transfer operations
 */
const AccountsScreen = () => {
  // Get user context
  const { user, balance, refreshProfile, updateBalance } = useUser();
  const queryClient = useQueryClient();

  // Modal states
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  // Form states
  const [amount, setAmount] = useState("");
  const [transferUsername, setTransferUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Fetch user's transactions
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: getMyTransactions,
    retry: 1,
  });

  // Fetch all users (for transfer dropdown)
  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    enabled: transferModalVisible, // Only fetch when transfer modal is open
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: deposit,
    onSuccess: (data) => {
      updateBalance(data.balance);
      queryClient.invalidateQueries({ queryKey: ["myTransactions"] });
      setDepositModalVisible(false);
      setAmount("");
      Alert.alert("Success", "Deposit successful! 💰");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to deposit money"
      );
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: withdraw,
    onSuccess: (data) => {
      updateBalance(data.balance);
      queryClient.invalidateQueries({ queryKey: ["myTransactions"] });
      setWithdrawModalVisible(false);
      setAmount("");
      Alert.alert("Success", "Withdrawal successful! 💸");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to withdraw money"
      );
    },
  });

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: ({ username, amount }: { username: string; amount: number }) =>
      transfer(username, { username, amount }),
    onSuccess: (data) => {
      updateBalance(data.balance);
      queryClient.invalidateQueries({ queryKey: ["myTransactions"] });
      setTransferModalVisible(false);
      setAmount("");
      setTransferUsername("");
      setSelectedUser(null);
      Alert.alert("Success", "Transfer successful! 🔄");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to transfer money"
      );
    },
  });

  // Handle deposit
  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    depositMutation.mutate({ amount: depositAmount });
  };

  // Handle withdraw
  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (withdrawAmount > balance) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }
    withdrawMutation.mutate({ amount: withdrawAmount });
  };

  // Handle transfer
  const handleTransfer = () => {
    const transferAmount = parseFloat(amount);
    const username = transferUsername.trim() || selectedUser?.username;

    if (!username) {
      Alert.alert("Error", "Please select or enter a username");
      return;
    }
    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (transferAmount > balance) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }
    transferMutation.mutate({ username, amount: transferAmount });
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
          {/* Balance Card */}
          <BalanceCard
            balance={balance}
            userName={user?.name || user?.username}
            userImage={user?.imageUrl}
          />

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.depositButton]}
              onPress={() => setDepositModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonIcon}>💰</Text>
              <Text style={styles.actionButtonText}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={() => setWithdrawModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonIcon}>💸</Text>
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.transferButton]}
              onPress={() => setTransferModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonIcon}>🔄</Text>
              <Text style={styles.actionButtonText}>Transfer</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactionsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : transactionsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading transactions</Text>
              </View>
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </View>
        </ScrollView>

        {/* Deposit Modal */}
        <Modal
          visible={depositModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDepositModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Deposit Money</Text>
                <TouchableOpacity
                  onPress={() => setDepositModalVisible(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={24} color={colors.secondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    depositMutation.isPending && styles.submitButtonDisabled,
                  ]}
                  onPress={handleDeposit}
                  disabled={depositMutation.isPending}
                >
                  {depositMutation.isPending ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Deposit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Withdraw Modal */}
        <Modal
          visible={withdrawModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setWithdrawModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Withdraw Money</Text>
                <TouchableOpacity
                  onPress={() => setWithdrawModalVisible(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={24} color={colors.secondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <Text style={styles.balanceHint}>
                  Available: ${balance.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    withdrawMutation.isPending && styles.submitButtonDisabled,
                  ]}
                  onPress={handleWithdraw}
                  disabled={withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Withdraw</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Transfer Modal */}
        <Modal
          visible={transferModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setTransferModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Transfer Money</Text>
                <TouchableOpacity
                  onPress={() => setTransferModalVisible(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={24} color={colors.secondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  value={transferUsername}
                  onChangeText={setTransferUsername}
                  placeholderTextColor="#999"
                />
                {users.length > 0 && (
                  <ScrollView
                    style={styles.usersList}
                    nestedScrollEnabled={true}
                  >
                    {users
                      .filter(
                        (u: any) =>
                          u.username !== user?.username &&
                          (!transferUsername ||
                            u.username
                              .toLowerCase()
                              .includes(transferUsername.toLowerCase()))
                      )
                      .slice(0, 5)
                      .map((u: any) => (
                        <TouchableOpacity
                          key={u._id}
                          style={[
                            styles.userItem,
                            selectedUser?._id === u._id &&
                              styles.userItemSelected,
                          ]}
                          onPress={() => {
                            setSelectedUser(u);
                            setTransferUsername(u.username);
                          }}
                        >
                          <Text style={styles.userItemText}>{u.username}</Text>
                          {u.name && (
                            <Text style={styles.userItemName}>{u.name}</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                )}
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <Text style={styles.balanceHint}>
                  Available: ${balance.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    transferMutation.isPending && styles.submitButtonDisabled,
                  ]}
                  onPress={handleTransfer}
                  disabled={transferMutation.isPending}
                >
                  {transferMutation.isPending ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Transfer</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  depositButton: {
    borderTopWidth: 3,
    borderTopColor: "#51cf66",
  },
  withdrawButton: {
    borderTopWidth: 3,
    borderTopColor: "#ff6b6b",
  },
  transferButton: {
    borderTopWidth: 3,
    borderTopColor: "#4dabf7",
  },
  actionButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondary,
  },
  transactionsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  balanceHint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: -10,
  },
  usersList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  userItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  userItemSelected: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.primary,
  },
  userItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondary,
  },
  userItemName: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AccountsScreen;
