import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import colors from "@/data/styling/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transfer } from "@/src/api/transactionsApi";
import { useRouter } from "expo-router";
import { getAllUsers } from "@/src/api/authApi";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";

const AddTransaction = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [amount, setAmount] = useState("");
  // const [date, setDate] = useState("");

  const navigate = useRouter();
  const { balance, updateBalance, refreshProfile } = useUser();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const { mutate } = useMutation({
    mutationFn: ({ username, amount }: { username: string; amount: number }) =>
      transfer(username, { username, amount }),
    onError: (err: any) => {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while transferring money";
      Alert.alert("Error", errorMessage);
    },
    onSuccess: async (data) => {
      updateBalance(data.balance);
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["myTransactions"] });
      Alert.alert("Success", "Money transferred successfully! 🔄");
      navigate.push("/(protected)/(tabs)/(home)");
    },
  });

  const handleAddTransaction = () => {
    if (!selectedUser || !amount) {
      Alert.alert("Missing info", "Please fill in all fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount greater than 0"
      );
      return;
    }

    if (parsedAmount > balance) {
      Alert.alert(
        "Insufficient Balance",
        "You don't have enough balance to transfer this amount"
      );
      return;
    }

    mutate({
      username: selectedUser.username,
      amount: parsedAmount,
    });
  };

  return (
    <>
      {/* @ts-ignore - React 19 compatibility issue with React Native types */}
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.heading}>Transfer Money</Text>
            <Text style={styles.subText}>Transfer money to another user</Text>

            <TouchableOpacity
              style={[styles.input, styles.userPicker]}
              onPress={() => setShowUserModal(true)}
            >
              <Text
                style={
                  selectedUser ? styles.selectedText : styles.placeholderText
                }
              >
                {selectedUser ? selectedUser.username : "Select a user"}
              </Text>
              <AntDesign name="down" size={16} color="#999" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Amount (e.g., 10 or -5)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {/* <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
            /> */}

            {/* @ts-ignore - React 19 compatibility issue with React Native types */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.submitText}>Transfer Money</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* User Selection Modal */}
      <Modal
        visible={showUserModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select User</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <AntDesign name="close" size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            {usersLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading users...</Text>
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userItem}
                    onPress={() => {
                      setSelectedUser(item);
                      setShowUserModal(false);
                    }}
                  >
                    <Text style={styles.userItemText}>{item.username}</Text>
                    {item.name && (
                      <Text style={styles.userItemName}>{item.name}</Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No users found</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
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
  userPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    color: colors.secondary,
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.secondary,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  userItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
  },
  userItemName: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
  },
});
