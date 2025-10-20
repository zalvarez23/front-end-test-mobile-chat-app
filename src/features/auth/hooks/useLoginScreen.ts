import { useRouter } from "expo-router";
import { useAppContext } from "@/src/shared/hooks/AppContext";

export function useLoginScreen() {
  const { users, login } = useAppContext();
  const router = useRouter();

  const handleUserSelect = async (userId: string) => {
    const success = await login(userId);
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return {
    users,
    handleUserSelect,
  };
}
