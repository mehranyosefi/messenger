// Room name helpers
export const getUserRoom = (userId: string): string => {
  return `user:${userId}`;
};

export const getConversationRoom = (conversationId: string): string => {
  return `conversation:${conversationId}`;
};

// User A
// room: user:65aaa

// User B
// room: user:65bbb

// Conversation
// room: conversation:123abc
