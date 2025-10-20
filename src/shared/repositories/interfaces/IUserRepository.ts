import { User } from "@/src/shared/types";

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | null>;
  createUser(userData: Omit<User, "id">): Promise<User | null>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
