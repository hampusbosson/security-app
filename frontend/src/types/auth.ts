export interface User {
  userId: number;          // from  JWT payload (dbUser.id)
  username: string;
  avatarUrl: string | null;
  email: string | null;
}