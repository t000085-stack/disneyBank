import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import colors from "@/data/styling/colors";
import { useRouter } from "expo-router";

interface UserProfileCardProps {
  imageUrl: string;
  email: string;
  username: string;
  userId?: string;
}

const UserProfileCard = ({
  imageUrl,
  email,
  username,
  userId,
}: UserProfileCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (userId) {
      router.push(`/(protected)/(tabs)/(home)/userId?userId=${userId}`);
    }
  };

  const CardContent = (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            imageUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        }}
        style={styles.image}
      />
      <Text style={styles.username}>{username || "User"}</Text>
      <Text style={styles.email}>{email || "No email"}</Text>
    </View>
  );

  if (userId) {
    return (
      <>
        {/* @ts-ignore - React 19 compatibility issue */}
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {CardContent}
        </TouchableOpacity>
      </>
    );
  }

  return CardContent;
};

export default UserProfileCard;

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 10,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.lightBlue,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.white,
  },
  email: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
    opacity: 0.8,
  },
});
