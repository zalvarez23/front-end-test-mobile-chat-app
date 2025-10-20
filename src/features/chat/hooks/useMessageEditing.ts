import { useState, useCallback } from "react";

interface EditingMessage {
  text: string;
  id: string;
}

export function useMessageEditing(
  editMessage?: (messageId: string, newText: string) => void
) {
  const [editMessageVisible, setEditMessageVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState<EditingMessage | null>(
    null
  );

  const handleEditMessage = useCallback(
    (messageId: string, currentText: string) => {
      setEditingMessage({ id: messageId, text: currentText });
      setEditMessageVisible(true);
    },
    []
  );

  const handleSaveEdit = useCallback(
    (newText: string) => {
      if (editingMessage && editMessage) {
        editMessage(editingMessage.id, newText);
      }
      setEditMessageVisible(false);
      setEditingMessage(null);
    },
    [editingMessage, editMessage]
  );

  const handleCancelEdit = useCallback(() => {
    setEditMessageVisible(false);
    setEditingMessage(null);
  }, []);

  return {
    editMessageVisible,
    editingMessage,
    handleEditMessage,
    handleSaveEdit,
    handleCancelEdit,
  };
}
