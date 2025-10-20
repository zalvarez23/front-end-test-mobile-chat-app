import { User } from "@/src/shared/types";

export interface LoginScreenProps {
  initialMessage?: string;
}

export interface UserSelectionListProps {
  users: User[];
  onUserSelect: (userId: string) => void;
  selectedUserId?: string;
}

export interface LoginButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export interface AuthLoadingProps {
  message?: string;
}

export interface LoginFormData {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
