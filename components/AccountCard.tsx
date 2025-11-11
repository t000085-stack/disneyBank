import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "@/data/styling/colors";
import { useRouter } from "expo-router";

interface Props {
  imageUrl: string;
  name: string;
  balance: number;
  accountId?: string;
}

const AccountCard = ({ imageUrl, name, balance, accountId }: Props) => {
  const router = useRouter();

  return (
    <>
      {/* @ts-ignore - React 19 compatibility issue */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accountId) {
            router.push(
              `/(protected)/(tabs)/(home)/userId?userId=${accountId}`
            );
          }
        }}
        activeOpacity={0.8}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.balance}>💰 ${balance.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default AccountCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.lightBlue,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 5,
  },
  balance: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
