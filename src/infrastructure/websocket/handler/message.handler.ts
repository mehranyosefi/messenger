// Receive message events and call MessageServices
//This handler should not contain database business logic.
import MessageServices from "../../../modules/messages/message.services";
import { SocketEvent } from "../websocket.events";
import { getConversationRoom, getUserRoom } from "../websocket.rooms";

import type { AppSocket, AppServer, SendMessagePayload, MessageSocketPayload, SendMessageEditPayload, SendMessageDeletePayload } from "../websocket.types";

const messageServices = new MessageServices();

const serializeMessage = (message: {
  _id: { toString(): string };
  conversation: { toString(): string };
  sender: { toString(): string };
  type: "text";
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}): MessageSocketPayload => {
  return {
    _id: message._id.toString(),
    conversation: message.conversation.toString(),
    sender: message.sender.toString(),
    type: message.type,
    content: message.content,
    status: message.status,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};

export const registerMessageHandlers = (io: AppServer, socket: AppSocket): void => {
  socket.on(SocketEvent.MESSAGE_SEND, async (data: SendMessagePayload, callback) => {
    try {
      const message = await messageServices.createMessage(socket.data.user.id, data.conversationId, data.content);
      const messagePayload = serializeMessage(message);
      callback?.({
        success: true,
        data: {
          message: messagePayload,
        },
      });
      io.to(getConversationRoom(data.conversationId)).emit(SocketEvent.MESSAGE_NEW, messagePayload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send message";

      callback?.({
        success: false,
        error: message,
      });

      socket.emit(SocketEvent.ERROR, {
        message,
      });
    }
  });
  socket.on(SocketEvent.MESSAGE_DELETE, async (data: SendMessageDeletePayload, callback) => {
    try {
      await messageServices.deleteMessage(socket.data.user.id, data.messageId);
      callback?.({
        success: true,
        data: {
          conversationId: data.conversationId,
          messageId: data.messageId
        },
      });
      io.to(getConversationRoom(data.conversationId)).emit(SocketEvent.MESSAGE_DELETED, {
        conversationId: data.conversationId,
        messageId: data.messageId
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to remove message";

      callback?.({
        success: false,
        error: message,
      });
    }
  });
  socket.on(SocketEvent.MESSAGE_EDIT, async (data: SendMessageEditPayload, callback) => {
    try {
      const message = await messageServices.updateMessage(socket.data.user.id, data.messageId, data.content);
      const messagePayload = serializeMessage(message);
      callback?.({
        success: true,
        data: null,
      });
      io.to(getConversationRoom(data.conversationId)).emit(SocketEvent.MESSAGE_EDITED, messagePayload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to edit message";

      callback?.({
        success: false,
        error: message,
      });
    }
  });
};
