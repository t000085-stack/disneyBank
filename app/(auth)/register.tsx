import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { storeToken } from "@/api/Storage";
import AuthContext from "@/context/AuthContext";

const { width, height } = Dimensions.get("window");

interface GlitterParticleProps {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
}

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [image, setImage] = useState<string>("");
  // const [name, setName] = useState<string>("");
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);

  const { mutate: registerMutation } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => register({ username, password }, image || "", ""),
    onSuccess: async (data: any) => {
      try {
        // Handle different possible response structures
        const token =
          data?.Token || data?.token || data?.accessToken || data?.access_token;

        if (!token) {
          console.error("No token in response:", data);
          Alert.alert("Error", "Registration successful but no token received");
          return;
        }

        await storeToken(token);

        // Wait a bit to ensure token is stored
        await new Promise((resolve) => setTimeout(resolve, 100));

        setIsAuthenticated(true);

        // Use replace instead of push to avoid navigation stack issues
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          router.replace("/(protected)/(tabs)");
        }, 200);
      } catch (error: any) {
        console.error("Error handling registration success:", error);
        Alert.alert("Error", "Failed to save registration information");
      }
    },
    onError: (error: any) => {
      console.log("Registration error:", error);
      console.log("Error response:", error?.response);
      console.log("Error data:", error?.response?.data);

      let errorMessage = "Registration failed";

      if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    },
  });

  // Handle image selection
  const handleImagePicker = async (): Promise<void> => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = (): void => {
    // Validation
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    registerMutation();
  };

  // Glitter component
  const GlitterParticle = ({
    delay,
    duration,
    startX,
    startY,
  }: GlitterParticleProps) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
      // Start rotation and scale loops immediately
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const animate = () => {
        opacity.setValue(0);
        translateY.setValue(0);

        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: duration - 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(translateY, {
            toValue: height,
            duration: duration,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => animate(), 500);
        });
      };

      const timer = setTimeout(() => {
        animate();
      }, delay);

      return () => clearTimeout(timer);
    }, [delay, duration]);

    const rotation = rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      // @ts-ignore - React 19 compatibility issue
      <Animated.View
        style={[
          styles.glitter,
          {
            left: startX,
            top: startY,
            opacity,
            transform: [{ translateY }, { rotate: rotation }, { scale }],
          },
        ]}
      >
        <Text style={styles.glitterText}>✨</Text>
      </Animated.View>
    );
  };

  // Generate glitter particles
  const glitterParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 200,
    duration: 3000 + Math.random() * 2000,
    startX: Math.random() * width,
    startY: -50 - Math.random() * 100,
  }));

  return (
    <LinearGradient
      colors={["#01147C", "#113CCF", "#BCEFFF", "#BFF5FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Glitter particles */}
      {glitterParticles.map((particle) => (
        <GlitterParticle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          startX={particle.startX}
          startY={particle.startY}
        />
      ))}
      {/* @ts-ignore - React 19 compatibility issue */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Bank Logo/Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🏰</Text>
            </View>
            <Text style={styles.appName}> Disney Bank</Text>
            <Text style={styles.tagline}>Where every coin starts a spark</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Magic Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Your username (for safety)"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Name Input */}
            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View> */}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Secret Code</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Secret Code</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Profile Picture Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profile Picture</Text>
              <View style={styles.imageUploadContainer}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Image
                      source={require("../../src/assets/images/mickey.jpg")}
                      style={styles.placeholderIconImage}
                    />
                  </View>
                )}
                {/* @ts-ignore - React 19 compatibility issue */}
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImagePicker}
                >
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            {/* @ts-ignore - React 19 compatibility issue */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>✨ Let's Go!</Text>
            </TouchableOpacity>

            {/* Toggle Sign Up / Login */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Already have an account?</Text>
              {/* @ts-ignore - React 19 compatibility issue */}
              <TouchableOpacity
                onPress={() => {
                  router.push("/(auth)/login");
                }}
              >
                <Text style={styles.toggleLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 SparkBank. All rights reserved.
            </Text>
            <Text style={styles.footerSubtext}>Secure • Fast • Reliable</Text>
          </View>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoEmoji: {
    fontSize: 100,
    textAlign: "center",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: "#E0F6FF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1f2937",
  },
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#dbeafe",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderIconImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  uploadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#113CCF",
    borderRadius: 16,
    padding: 14,
    gap: 8,
    backgroundColor: "#BFF5FD",
  },
  uploadIcon: {
    fontSize: 20,
  },
  uploadText: {
    fontSize: 12,
    color: "#01147C",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#113CCF",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#BCEFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#01147C",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 5,
  },
  toggleText: {
    color: "#6b7280",
    fontSize: 14,
  },
  toggleLink: {
    color: "#BCEFFF",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footer: {
    alignItems: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#4A5568",
    fontSize: 12,
  },
  footerSubtext: {
    color: "#718096",
    fontSize: 12,
    marginTop: 5,
  },
  glitter: {
    position: "absolute",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  glitterText: {
    fontSize: 16,
    color: "#FFFFFF",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});

export default Register;
