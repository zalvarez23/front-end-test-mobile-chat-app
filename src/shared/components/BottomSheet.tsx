import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface BottomSheetOption {
  id: string;
  title: string;
  icon?: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: BottomSheetOption[];
  showCancel?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  options,
  showCancel = true,
}: BottomSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    onClose();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.container,
                {
                  backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                  transform: [{ translateY }],
                },
              ]}
            >
              {/* Handle */}
              <View
                style={[
                  styles.handle,
                  { backgroundColor: isDark ? "#333" : "#ccc" },
                ]}
              />

              {/* Title */}
              {title && (
                <View style={styles.titleContainer}>
                  <Text
                    style={[
                      styles.title,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              )}

              {/* Options */}
              <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.option,
                      index === options.length - 1 && styles.lastOption,
                      option.destructive && styles.destructiveOption,
                    ]}
                    onPress={() => {
                      option.onPress();
                      handleClose();
                    }}
                  >
                    {option.icon && (
                      <MaterialIcons
                        name={option.icon as any}
                        size={20}
                        color={
                          option.destructive
                            ? "#ff4444"
                            : isDark
                            ? "#ffffff"
                            : "#000000"
                        }
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: option.destructive
                            ? "#ff4444"
                            : isDark
                            ? "#ffffff"
                            : "#000000",
                        },
                      ]}
                    >
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cancel Button */}
              {showCancel && (
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                  ]}
                  onPress={handleClose}
                >
                  <Text
                    style={[
                      styles.cancelText,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  destructiveOption: {},
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
