export enum AccountTypeEnum {
  Checking = "Checking",
  Savings = "Savings",
  Rewards = "Rewards",
}

export interface AccountType {
  _id: string;
  name: string;
  balance: number;
  imageUrl?: string;
  accountNumber?: string;
  type?: AccountTypeEnum;
}

export interface TransactionType {
  _id: string;
  title: string;
  amount: number;
  // date: string;
  accountId?: string;
}

export interface GoalType {
  _id: string;
  title: string;
  target: number;
  saved: number;
}
