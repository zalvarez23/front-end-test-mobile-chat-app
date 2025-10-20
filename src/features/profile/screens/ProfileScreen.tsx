import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "@/src/shared/hooks/AppContext";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileInfo } from "../components/ProfileInfo";
import { LogoutButton } from "../components/LogoutButton";
import { ProfileLoading } from "../components/ProfileLoading";

export default function ProfileScreen() {
  const { currentUser, logout } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();

  };

  if (!currentUser) {
    return <ProfileLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ProfileHeader user={currentUser} />
        <ProfileInfo user={currentUser} />
        <LogoutButton onPress={handleLogout} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
});
