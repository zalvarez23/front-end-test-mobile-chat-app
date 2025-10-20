import React from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";

interface EditMessageInputProps {
  currentText: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

export function EditMessageInput({
  currentText,
  onSave,
  onCancel,
}: EditMessageInputProps) {
  const [editedText, setEditedText] = React.useState(currentText);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  React.useEffect(() => {
    setEditedText(currentText);
  }, [currentText]);

  const handleSave = () => {
    if (editedText.trim() && editedText.trim() !== currentText.trim()) {
      onSave(editedText.trim());
    }
    onCancel();
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
          styles.inputContainer,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            {
              color: isDark ? "#ECEDEE" : "#11181C",
            },
          ]}
          value={editedText}
          onChangeText={setEditedText}
          placeholder="Edit message..."
          placeholderTextColor={isDark ? "#9BA1A6" : "#687076"}
          multiline
          autoFocus
          maxLength={1000}
          onBlur={onCancel}
        />

        <Pressable
          style={[
            styles.saveButton,
            {
              backgroundColor:
                editedText.trim() && editedText.trim() !== currentText.trim()
                  ? "#007AFF"
                  : isDark
                  ? "#48484A"
                  : "#E5E5EA",
            },
          ]}
          onPress={handleSave}
          disabled={
            !editedText.trim() || editedText.trim() === currentText.trim()
          }
        >
          <IconSymbol
            name="checkmark"
            size={16}
            color={
              editedText.trim() && editedText.trim() !== currentText.trim()
                ? "#FFFFFF"
                : isDark
                ? "#9BA1A6"
                : "#687076"
            }
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
