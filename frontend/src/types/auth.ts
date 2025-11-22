export interface User {
  userId: number;          // from  JWT payload (dbUser.id)
  username: string;
  avatar: string | null;
  email: string | null;
}