import instance from "@/api";
import {
  Transaction,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
} from "@/src/types/transaction";

/**
 * Gets the current user's transactions
 * GET /mini-project/api/transactions/my
 * Ensures all transactions have a date field
 */
export const getMyTransactions = async (): Promise<Transaction[]> => {
  const { data } = await instance.get("/mini-project/api/transactions/my");

  // Ensure all transactions have a date
  return (data || []).map((transaction: Transaction) => ({
    ...transaction,
    date: transaction.date || new Date().toISOString(),
  }));
};

/**
 * Deposits money into the user's account
 * PUT /mini-project/api/transactions/deposit
 */
export const deposit = async (
  request: DepositRequest
): Promise<{ balance: number }> => {
  const { data } = await instance.put(
    "/mini-project/api/transactions/deposit",
    request
  );
  return data;
};

/**
 * Withdraws money from the user's account
 * PUT /mini-project/api/transactions/withdraw
 */
export const withdraw = async (
  request: WithdrawRequest
): Promise<{ balance: number }> => {
  const { data } = await instance.put(
    "/mini-project/api/transactions/withdraw",
    request
  );
  return data;
};

/**
 * Transfers money to another user
 * PUT /mini-project/api/transactions/transfer/<username>
 */
export const transfer = async (
  username: string,
  request: TransferRequest
): Promise<{ balance: number }> => {
  const { data } = await instance.put(
    `/mini-project/api/transactions/transfer/${username}`,
    { amount: request.amount }
  );
  return data;
};
