import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { UserListItem } from "@/src/shared/components/UserListItem";
import { UserSelectionListProps } from "../types";

export function UserSelectionList({
  users,
  onUserSelect,
  selectedUserId,
}: UserSelectionListProps) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserListItem
          user={item}
          onSelect={() => onUserSelect(item.id)}
          isSelected={selectedUserId === item.id}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
});
