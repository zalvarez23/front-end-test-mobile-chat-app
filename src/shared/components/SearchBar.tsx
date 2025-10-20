import React from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  value?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = "Search messages...",
  onSearch,
  onClear,
  value,
  autoFocus = false,
}: SearchBarProps) {
  const [searchText, setSearchText] = React.useState(value || "");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSearch = () => {
    onSearch(searchText.trim());
  };

  const handleClear = () => {
    setSearchText("");
    onClear?.();
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (text === "") {
      onClear?.();
    } else {

      onSearch(text.trim());
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#2A2C33" : "#F2F2F7" },
      ]}
    >
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <IconSymbol
          name="magnifyingglass"
          size={16}
          color={isDark ? "#9BA1A6" : "#687076"}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? "#ECEDEE" : "#11181C",
            },
          ]}
          value={searchText}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#9BA1A6" : "#687076"}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        {searchText.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <IconSymbol
              name="xmark.circle.fill"
              size={16}
              color={isDark ? "#9BA1A6" : "#687076"}
            />
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 2,
  },
});
