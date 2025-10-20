import { useState, useEffect, useCallback, useMemo } from "react";
import { UserService } from "@/src/shared/services/UserService";
import { User, UseUserServiceReturn } from "@/src/shared/types";

export function useUserService(): UseUserServiceReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const userService = useMemo(() => new UserService(), []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userService]);

  const createUser = useCallback(
    async (userData: Omit<User, "id">) => {
      const newUser = await userService.createUser(userData);
      if (newUser) {
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
      return newUser;
    },
    [userService]
  );

  const updateUser = useCallback(
    async (userId: string, updates: Partial<User>) => {
      const success = await userService.updateUser(userId, updates);
      if (success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, ...updates } : user
          )
        );
      }
      return success;
    },
    [userService]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      const success = await userService.deleteUser(userId);
      if (success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
      return success;
    },
    [userService]
  );

  return useMemo(
    () => ({
      users,
      createUser,
      updateUser,
      deleteUser,
      loading,
    }),
    [users, createUser, updateUser, deleteUser, loading]
  );
}
