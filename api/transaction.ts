import instance from ".";
import { TransactionType } from "@/types/BankTypes";
import UserInfo from "@/types/UserInfo";

// const getAllUser = async () => {
//   const { data } = await instance.get("/auth/users");
//   return data;
// };

const getUserTransaction = async (userId: string) => {
  const { data } = await instance.get(
    `/mini-project/api/transactions/my-transaction/${userId}`
  );
  return data;
};

const createUserTransaction = async (
  userId: string,
  transactionInfo: TransactionType
) => {
  const { data } = await instance.post(
    `/transactions/my-transaction/${userId}`,
    transactionInfo
  );
  return data;
};

const updateUserProfile = async (userId: string, userInfo: UserInfo) => {
  const { data } = await instance.put(`/auth/profile/${userId}`, userInfo);
  return data;
};

export {
  //   getAllUser,
  createUserTransaction,
  updateUserProfile,
  getUserTransaction,
};
