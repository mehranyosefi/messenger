// TypeScript socket/event types

import type { Socket, Server } from "socket.io";

export interface SocketUser {
  id: string;
}

export interface ClientToServerEvents {
  "message:send": (
    data: SendMessagePayload,
    callback?: SocketCallback<SendMessageResponse>,
  ) => void;
  "message:delete": (
    data: SendMessageDeletePayload,
    callback?: SocketCallback<null>,
  ) => void;
  "message:edit": (
    data: SendMessageEditPayload,
    callback?: SocketCallback<null>,
  ) => void;
  "conversation:join": (data: ConversationRoomPayload) => void;
  "conversation:leave": (data: ConversationRoomPayload) => void;
  "typing:start": (data: ConversationRoomPayload) => void;
  "typing:stop": (data: ConversationRoomPayload) => void;
}

export interface ServerToClientEvents {
  "message:new": (data: MessageSocketPayload) => void;
  "message:deleted": (data: null) => void;
  "message:edited": (data: MessageSocketPayload) => void;
  "typing:start": (data: TypingSocketPayload) => void;
  "typing:stop": (data: TypingSocketPayload) => void;
  error: (data: SocketErrorPayload) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: SocketUser;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}
export interface SendMessageDeletePayload {
  conversationId: string;
  messageId: string;
}

export interface SendMessageEditPayload {
  conversationId: string;
  messageId: string;
  content: string;
}

export interface ConversationRoomPayload {
  conversationId: string;
}

export interface MessageSocketPayload {
  _id: string;
  conversation: string;
  sender: string;
  type: "text";
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingSocketPayload {
  userId: string;
  conversationId: string;
}

export interface SocketErrorPayload {
  message: string;
}

export interface SocketCallback<T> {
  (
    response:
      | {
          success: true;
          data: T;
        }
      | {
          success: false;
          error: string;
        },
  ): void;
}

export interface SendMessageResponse {
  message: MessageSocketPayload;
}

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
