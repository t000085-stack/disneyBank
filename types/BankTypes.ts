export interface AccountType {
  _id: string;
  name: string;
  balance: number;
  imageUrl?: string;
}

export interface TransactionType {
  _id: string;
  title: string;
  amount: number;
  date: string;
  accountId: string;
}

export interface GoalType {
  _id: string;
  title: string;
  target: number;
  saved: number;
}
