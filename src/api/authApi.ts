import instance from "@/api";
import { UserProfile } from "@/src/types/account";

/**
 * Fetches the current user's profile including balance
 * GET /mini-project/api/auth/me
 */
export const getProfile = async (): Promise<UserProfile> => {
  const { data } = await instance.get("/mini-project/api/auth/me");
  return data;
};

/**
 * Gets all users (for transfer functionality)
 * GET /mini-project/api/auth/users
 */
export const getAllUsers = async () => {
  const { data } = await instance.get("/mini-project/api/auth/users");
  return data;
};

/**
 * Gets user info by userId
 * GET /mini-project/api/auth/user/<userId>
 */
export const getUserById = async (userId: string) => {
  const { data } = await instance.get(`/mini-project/api/auth/user/${userId}`);
  return data;
};
