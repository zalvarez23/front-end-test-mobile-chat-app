import { db } from "@/src/core/database/db";
import { users } from "@/src/core/database/schema";
import { eq } from "drizzle-orm";
import { IUserRepository } from "./interfaces/IUserRepository";
import { User } from "@/src/shared/types";

export class SqliteUserRepository implements IUserRepository {
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserById(userId: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, userId));
    return result[0] || null;
  }

  async createUser(userData: Omit<User, "id">): Promise<User | null> {
    try {
      const newUser: User = {
        id: `user${Date.now()}`,
        ...userData,
      };

      await db.insert(users).values(newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await db.update(users).set(updates).where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }
}
