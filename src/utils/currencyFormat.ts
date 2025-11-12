export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 4) {
    return "•••• ••••";
  }
  const lastFour = accountNumber.slice(-4);
  return `•••• ${lastFour}`;
};
