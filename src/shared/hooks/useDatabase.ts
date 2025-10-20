import { useDatabaseStatus } from "@/src/core/database/DatabaseProvider";

export function useDatabase() {
  return useDatabaseStatus();
}
