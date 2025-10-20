import { IUserRepository } from "@/src/shared/repositories/interfaces/IUserRepository";
import { SqliteUserRepository } from "@/src/shared/repositories/SqliteUserRepository";
import { User } from "@/src/shared/types";

export class UserService {
  private repository: IUserRepository;

  constructor(repository?: IUserRepository) {
    this.repository = repository || new SqliteUserRepository();
  }


  async getAllUsers(): Promise<User[]> {
    try {
      return await this.repository.getAllUsers();
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.repository.getUserById(userId);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  async createUser(userData: Omit<User, "id">): Promise<User | null> {
    try {

      if (!userData.name || !userData.avatar) {
        throw new Error("Name and avatar are required");
      }

      return await this.repository.createUser(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      await this.repository.updateUser(userId, updates);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.repository.deleteUser(userId);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}
