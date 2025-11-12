import instance from ".";
import { AccountType, TransactionType, GoalType } from "@/types/BankTypes";

/* ------------------- ACCOUNTS ------------------- */
export const getAllAccounts = async () => {
  const { data } = await instance.get("/accounts");
  return data;
};

export const getAccount = async (accountId: string) => {
  const { data } = await instance.get(`/accounts/${accountId}`);
  return data;
};

export const createAccount = async (accountInfo: AccountType) => {
  const { data } = await instance.post("/accounts", accountInfo);
  return data;
};

export const updateAccount = async (accountInfo: AccountType) => {
  const { data } = await instance.put(
    `/accounts/${accountInfo._id}`,
    accountInfo
  );
  return data;
};

export const deleteAccount = async (accountId: string) => {
  const { data } = await instance.delete(`/accounts/${accountId}`);
  return data;
};

/* ------------------- TRANSACTIONS ------------------- */
export const getAllTransactions = async () => {
  const { data } = await instance.get("/transactions");
  return data;
};

export const createTransaction = async (transactionInfo: TransactionType) => {
  const { data } = await instance.post(
    "/mini-project/api/transactions",
    transactionInfo
  );
  return data;
};

/* ------------------- SAVINGS GOALS ------------------- */
export const getAllGoals = async () => {
  const { data } = await instance.get("/goals");
  return data;
};

export const createGoal = async (goalInfo: GoalType) => {
  const { data } = await instance.post("/goals", goalInfo);
  return data;
};
