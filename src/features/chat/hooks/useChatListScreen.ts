import { useState } from "react";
import { useAppContext } from "@/src/shared/hooks/AppContext";

export function useChatListScreen() {
  const { currentUser, users, chats, createChat } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateChat = async () => {
    if (currentUser && selectedUsers.length > 0) {
      const participants = [currentUser.id, ...selectedUsers];
      await createChat(participants);
      setModalVisible(false);
      setSelectedUsers([]);
    }
  };

  const openNewChatModal = () => {
    setModalVisible(true);
  };

  const closeNewChatModal = () => {
    setModalVisible(false);
    setSelectedUsers([]);
  };

  const availableUsers = users.filter((user) => user.id !== currentUser?.id);

  return {
    currentUser,
    users,
    chats,
    modalVisible,
    selectedUsers,
    availableUsers,
    toggleUserSelection,
    handleCreateChat,
    openNewChatModal,
    closeNewChatModal,
  };
}
