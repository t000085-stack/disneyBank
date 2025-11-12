import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import colors from "@/data/styling/colors";
import { useRouter } from "expo-router";
import { formatCurrency } from "@/src/utils/currencyFormat";
import { AntDesign } from "@expo/vector-icons";

interface UserProfileCardProps {
  imageUrl: string;
  email: string;
  username: string;
  userId?: string;
  balance?: number;
  accountNumber?: string;
  accountType?: string;
}

/**
 * Helper function to get a valid image URL from various formats
 * Handles base64, full URLs, relative paths, local file paths, and invalid values
 */
const getValidImageUrl = (
  imagePath: string | null | undefined
): string | null => {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  // Handle invalid values like "[object Object]"
  if (
    imagePath === "[object Object]" ||
    imagePath === "undefined" ||
    imagePath === "null"
  ) {
    return null;
  }

  // Base64 images - return as is
  if (imagePath.startsWith("data:image/")) {
    return imagePath;
  }

  // Full URLs - return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Local file paths (file://) - these won't work for other users, return null to use default
  if (imagePath.startsWith("file://")) {
    return null;
  }

  // Relative paths starting with "/" - prepend base URL
  if (imagePath.startsWith("/")) {
    return `https://react-bank-project.eapi.joincoded.com${imagePath}`;
  }

  // Relative paths like "media/..." - prepend base URL with "/"
  if (!imagePath.startsWith("http")) {
    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `https://react-bank-project.eapi.joincoded.com${normalizedPath}`;
  }

  return null;
};

const UserProfileCard = ({
  imageUrl,
  email,
  username,
  userId,
  balance,
  accountNumber,
  accountType,
}: UserProfileCardProps) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const validImageUrl = getValidImageUrl(imageUrl);
  const displayImageUrl = validImageUrl || "";

  const handlePress = () => {
    if (userId) {
      console.log("🔵 UserProfileCard pressed - userId:", userId);
      try {
        router.push(`/(protected)/(tabs)/(home)/userId?userId=${userId}`);
      } catch (error) {
        console.error("❌ Navigation error:", error);
      }
    } else {
      console.warn("⚠️ UserProfileCard pressed but userId is missing");
    }
  };

  const CardContent = (
    <View style={styles.card}>
      {!validImageUrl || imageError ? (
        <View style={styles.imagePlaceholder}>
          <AntDesign name="user" size={40} color={colors.primary} />
        </View>
      ) : (
        <Image
          source={{ uri: displayImageUrl }}
          style={styles.image}
          onError={() => {
            console.log("Image load error for:", displayImageUrl);
            setImageError(true);
          }}
          onLoad={() => {
            setImageError(false);
          }}
        />
      )}
      <Text style={styles.username}>{username || "User"}</Text>
      <Text style={styles.email}>{email || "No email"}</Text>

      {/* Account Information */}
      {(balance !== undefined || accountNumber || accountType) && (
        <View style={styles.accountInfo}>
          {balance !== undefined && (
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>💰 Balance:</Text>
              <Text style={styles.accountValue}>{formatCurrency(balance)}</Text>
            </View>
          )}
          {accountNumber && (
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>🏦 Account:</Text>
              <Text style={styles.accountValue}>{accountNumber}</Text>
            </View>
          )}
          {accountType && (
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>📋 Type:</Text>
              <Text style={styles.accountValue}>{accountType}</Text>
            </View>
          )}
        </View>
      )}
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
    backgroundColor: colors.lightBlue,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
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
  accountInfo: {
    marginTop: 15,
    width: "100%",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    fontWeight: "500",
  },
  accountValue: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold",
  },
});
