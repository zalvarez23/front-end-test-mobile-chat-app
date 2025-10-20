import { IAuthRepository } from "@/src/shared/repositories/interfaces/IAuthRepository";
import { SqliteAuthRepository } from "@/src/shared/repositories/SqliteAuthRepository";
import { User } from "@/src/shared/types";

export class AuthService {
  private repository: IAuthRepository;

  constructor(repository?: IAuthRepository) {
    this.repository = repository || new SqliteAuthRepository();
  }


  async login(userId: string): Promise<User | null> {
    try {

      if (!userId || userId.trim() === "") {
        throw new Error("User ID is required for login");
      }

      const user = await this.repository.login(userId.trim());

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Error in AuthService.login:", error);
      return null;
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim() === "") {
        throw new Error("User ID is required for logout");
      }

      await this.repository.logout(userId.trim());
      return true;
    } catch (error) {
      console.error("Error in AuthService.logout:", error);
      return false;
    }
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      if (!userId || userId.trim() === "") {
        return null;
      }

      return await this.repository.getCurrentUser(userId.trim());
    } catch (error) {
      console.error("Error in AuthService.getCurrentUser:", error);
      return null;
    }
  }

  async validateUser(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim() === "") {
        return false;
      }

      return await this.repository.validateUser(userId.trim());
    } catch (error) {
      console.error("Error in AuthService.validateUser:", error);
      return false;
    }
  }
}
