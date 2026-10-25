//Central event names
export const SocketEvent = {
  CONNECTION: "connection",

  ERROR: "error",

  MESSAGE_SEND: "message:send",
  MESSAGE_NEW: "message:new",
  MESSAGE_DELETE: "message:delete",
  MESSAGE_DELETED: "message:deleted",
  MESSAGE_EDIT: "message:edit",
  MESSAGE_EDITED: "message:edited",

  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ: "message:read",

  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",

  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
} as const;

export type SocketEventName = (typeof SocketEvent)[keyof typeof SocketEvent];
