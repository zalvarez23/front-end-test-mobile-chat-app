import { db } from "@/src/core/database/db";
import { users } from "@/src/core/database/schema";
import { eq } from "drizzle-orm";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { User } from "@/src/shared/types";

export class SqliteAuthRepository implements IAuthRepository {
  async login(userId: string): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      return result[0] || null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

  async logout(userId: string): Promise<void> {


    console.log(`User ${userId} logged out`);
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      return result[0] || null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  async validateUser(userId: string): Promise<boolean> {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      return result.length > 0;
    } catch (error) {
      console.error("Error validating user:", error);
      return false;
    }
  }
}
