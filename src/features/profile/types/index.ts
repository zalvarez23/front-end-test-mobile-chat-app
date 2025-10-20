import { User } from "@/src/shared/types";

export interface ProfileHeaderProps {
  user: User;
}

export interface ProfileInfoProps {
  user: User;
}

export interface LogoutButtonProps {
  onPress: () => void;
}

export interface ProfileLoadingProps {
  message?: string;
}

export interface ProfileScreenProps {
  initialTab?: string;
  showEditButton?: boolean;
}

export interface ProfileSettings {
  notifications: boolean;
  theme: "light" | "dark" | "auto";
  language: string;
}

export interface ProfileEditData {
  name?: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
}
