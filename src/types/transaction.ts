export enum TransactionType {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
  Transfer = "Transfer",
}

export interface Transaction {
  _id: string;
  type: TransactionType | string;
  amount: number;
  date: string;
  description?: string;
  fromUser?: string;
  toUser?: string;
  username?: string; // For transfer transactions
}

export interface DepositRequest {
  amount: number;
}

export interface WithdrawRequest {
  amount: number;
}

export interface TransferRequest {
  username: string;
  amount: number;
}
