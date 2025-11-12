export interface UserProfile {
  _id: string;
  username: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  image?: string;
  balance: number;
}

export interface AccountBalance {
  balance: number;
  currency?: string;
}
