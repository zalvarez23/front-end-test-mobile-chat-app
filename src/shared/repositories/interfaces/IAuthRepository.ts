import { User } from "@/src/shared/types";

export interface IAuthRepository {
  login(userId: string): Promise<User | null>;
  logout(userId: string): Promise<void>;
  getCurrentUser(userId: string): Promise<User | null>;
  validateUser(userId: string): Promise<boolean>;
}
