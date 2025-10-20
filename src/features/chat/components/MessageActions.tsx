import React from "react";
import {
  BottomSheet,
  BottomSheetOption,
} from "@/src/shared/components/BottomSheet";

interface MessageActionsProps {
  isCurrentUser: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  onClose?: () => void;
}

export function MessageActions({
  isCurrentUser,
  onEdit,
  onDelete,
  showActions = false,
  onClose,
}: MessageActionsProps) {
  if (!showActions || !isCurrentUser) {
    return null;
  }

  const bottomSheetOptions: BottomSheetOption[] = [
    ...(onEdit
      ? [
          {
            id: "edit",
            title: "Edit Message",
            icon: "edit",
            onPress: onEdit,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            id: "delete",
            title: "Delete Message",
            icon: "delete",
            destructive: true,
            onPress: onDelete,
          },
        ]
      : []),
  ];

  return (
    <BottomSheet
      visible={showActions}
      onClose={onClose || (() => {})}
      title="Message Options"
      options={bottomSheetOptions}
    />
  );
}
