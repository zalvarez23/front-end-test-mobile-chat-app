import { useRef, useCallback } from "react";
import { FlatList } from "react-native";
import { Message } from "../types";

export function useScrollToBottom() {
  const flatListRef = useRef<FlatList<Message>>(null);

  const scrollToBottom = useCallback(
    (animated: boolean = true, delay?: number) => {
      const scrollAction = () => {
        flatListRef.current?.scrollToEnd({ animated });
      };

      if (delay) {
        setTimeout(scrollAction, delay);
      } else {
        scrollAction();
      }
    },
    []
  );

  const scrollToBottomImmediate = useCallback(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  const scrollToBottomAnimated = useCallback(() => {
    scrollToBottom(true);
  }, [scrollToBottom]);

  const scrollToBottomWithDelay = useCallback(
    (delay: number = 100, animated: boolean = true) => {
      scrollToBottom(animated, delay);
    },
    [scrollToBottom]
  );

  return {
    flatListRef,
    scrollToBottom,
    scrollToBottomImmediate,
    scrollToBottomAnimated,
    scrollToBottomWithDelay,
  };
}
