import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { AuthHeader } from "../components/AuthHeader";
import { UserSelectionList } from "../components/UserSelectionList";
import { AuthLoading } from "../components/AuthLoading";
import { useLoginScreen } from "../hooks/useLoginScreen";

export default function LoginScreen() {
  const { users, handleUserSelect } = useLoginScreen();

  if (!users || users.length === 0) {
    return <AuthLoading message="Loading users..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ThemedView style={styles.container}>
        <AuthHeader
          title="Welcome to Chat App"
          subtitle="Select a user to continue"
        />
        <UserSelectionList users={users} onUserSelect={handleUserSelect} />
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
    paddingTop: 20,
  },
});
