import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "@/data/styling/colors";
import { getMyTransactions } from "@/src/api/transactionsApi";
import { Transaction } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/currencyFormat";

/**
 * All Transactions Page
 * Displays all user transactions using GET /mini-project/api/transactions/my
 */
const AllTransactions = () => {
  const router = useRouter();
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: getMyTransactions,
    retry: 1,
  });

  // Filter transactions based on search criteria
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((transaction) => {
      // Filter by date
      if (searchDate) {
        try {
          const transactionDate = new Date(transaction.date)
            .toISOString()
            .split("T")[0];
          const searchDateFormatted = searchDate.trim();
          if (transactionDate !== searchDateFormatted) {
            return false;
          }
        } catch {
          // If date parsing fails, skip date filter
        }
      }

      // Filter by amount
      if (searchAmount) {
        const searchAmountNum = parseFloat(searchAmount);
        if (!isNaN(searchAmountNum)) {
          // Match exact amount (with small tolerance for floating point)
          const transactionAmount = Math.abs(transaction.amount);
          if (Math.abs(transactionAmount - searchAmountNum) > 0.01) {
            return false;
          }
        }
      }

      return true;
    });
  }, [transactions, searchDate, searchAmount]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
        // Format date as YYYY-MM-DD
        const formattedDate = date.toISOString().split("T")[0];
        setSearchDate(formattedDate);
      } else {
        // User cancelled on Android
        setSelectedDate(null);
      }
    } else if (Platform.OS === "ios") {
      // On iOS, update selectedDate as user scrolls, but don't close picker
      // The picker will close when user taps the check button
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    // Check if it's a deposit - deposits should show "-" instead of "+"
    const isDeposit = item.type?.toLowerCase() === "deposit";
    const isPositive = item.amount > 0;
    // For deposits, reverse the sign logic
    const showPositive = isDeposit ? !isPositive : isPositive;
    const amountColor = showPositive ? "#51cf66" : "#ff6b6b";

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionContent}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionType}>
              {item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}
            </Text>
            {item.username && (
              <Text style={styles.username}>
                {item.type === "Transfer"
                  ? `To: ${item.username}`
                  : item.username}
              </Text>
            )}
            <Text style={styles.date}>📅 {formatDate(item.date)}</Text>
          </View>
          <Text
            style={[
              styles.amount,
              { color: isDeposit ? "#51cf66" : "#ff6b6b" },
            ]}
          >
            {isDeposit ? "+" : "-"}
            {formatCurrency(Math.abs(item.amount))}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.errorContainer}>
            <AntDesign
              name="exclamation-circle"
              size={50}
              color={colors.white}
            />
            <Text style={styles.errorText}>Error loading transactions</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.title}>💰 All Transactions</Text>
          <Text style={styles.subtitle}>
            {filteredTransactions?.length || 0} transaction
            {filteredTransactions?.length !== 1 ? "s" : ""}
            {(searchDate || searchAmount) && transactions
              ? ` of ${transactions.length} total`
              : ""}
          </Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TouchableOpacity
              style={styles.searchInputContainer}
              onPress={() => {
                if (!selectedDate) {
                  setSelectedDate(new Date());
                }
                setShowDatePicker(true);
              }}
            >
              <AntDesign
                name="calendar"
                size={20}
                color={colors.white}
                style={styles.searchIcon}
              />
              <Text
                style={[
                  styles.searchInput,
                  !searchDate && styles.placeholderText,
                ]}
              >
                {searchDate || "Search by date (YYYY-MM-DD)"}
              </Text>
              {searchDate ? (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setSearchDate("");
                    setSelectedDate(null);
                  }}
                >
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color={colors.white}
                  />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal for iOS */}
          {Platform.OS === "ios" && showDatePicker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Date</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const formattedDate = selectedDate
                            .toISOString()
                            .split("T")[0];
                          setSearchDate(formattedDate);
                        }
                      }}
                    >
                      <AntDesign
                        name="check"
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "compact" : "default"}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      themeVariant="light"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowDatePicker(false);
                      if (!selectedDate) {
                        setSearchDate("");
                      }
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Android Date Picker (shown inline) */}
          {Platform.OS === "android" && showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <AntDesign
                name="dollar"
                size={20}
                color={colors.white}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by amount"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={searchAmount}
                onChangeText={setSearchAmount}
                keyboardType="decimal-pad"
              />
              {searchAmount ? (
                <TouchableOpacity onPress={() => setSearchAmount("")}>
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color={colors.white}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        <FlatList
          data={filteredTransactions || []}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AntDesign name="inbox" size={60} color={colors.white} />
              <Text style={styles.emptyText}>
                {searchDate || searchAmount
                  ? "No transactions match your search"
                  : "No transactions found"}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchDate || searchAmount
                  ? "Try adjusting your search criteria"
                  : "Your transaction history will appear here"}
              </Text>
            </View>
          }
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  errorSubtext: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#E0F6FF",
    opacity: 0.9,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  transactionCard: {
    backgroundColor: colors.secondary,
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
  transactionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  username: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
    marginTop: 5,
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 12,
  },
  searchRow: {
    flexDirection: "row",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.6)",
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
    padding: 12,
    maxHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.secondary,
  },
  datePickerContainer: {
    width: "100%",
    minHeight: 140,
    maxHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 5,
  },
  datePicker: {
    width: "100%",
    height: 200,
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AllTransactions;
