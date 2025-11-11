// import AsyncStorage from "@react-native-async-storage/async-storage";

// const TOKEN_KEY = "@auth_token";

// export const getToken = async (): Promise<string | null> => {
//   try {
//     const token = await AsyncStorage.getItem(TOKEN_KEY);
//     return token;
//   } catch (error) {
//     console.error("Error getting token:", error);
//     return null;
//   }
// };

// export const setToken = async (token: string): Promise<void> => {
//   try {
//     await AsyncStorage.setItem(TOKEN_KEY, token);
//   } catch (error) {
//     console.error("Error setting token:", error);
//     throw error;
//   }
// };

// export const removeToken = async (): Promise<void> => {
//   try {
//     await AsyncStorage.removeItem(TOKEN_KEY);
//   } catch (error) {
//     console.error("Error removing token:", error);
//     throw error;
//   }
// };

import AsyncStorage from "@react-native-async-storage/async-storage";

const storeToken = async (value: string) => {
  try {
    await AsyncStorage.setItem("token", value);
  } catch (error) {
    console.log(error);
  }
};

const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
};

export { storeToken, getToken, deleteToken };
