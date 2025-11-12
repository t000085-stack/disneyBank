import React, { createContext, useContext, useState, ReactNode } from "react";
import { AccountType } from "@/types/BankTypes";

interface AccountsContextType {
  accounts: AccountType[];
  setAccounts: (accounts: AccountType[]) => void;
  addAccount: (account: AccountType) => void;
  updateAccount: (accountId: string, updates: Partial<AccountType>) => void;
  deleteAccount: (accountId: string) => void;
}

const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined
);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  const addAccount = (account: AccountType) => {
    setAccounts((prev) => [...prev, account]);
  };

  const updateAccount = (accountId: string, updates: Partial<AccountType>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc._id === accountId ? { ...acc, ...updates } : acc))
    );
  };

  const deleteAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc._id !== accountId));
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        setAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within AccountsProvider");
  }
  return context;
};
