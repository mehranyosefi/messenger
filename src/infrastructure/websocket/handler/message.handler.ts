// Receive message events and call MessageServices
//This handler should not contain database business logic.
import MessageServices from "../../../modules/messages/message.services";
import {
  SocketEvent,
} from "../websocket.events";
import {
  getConversationRoom,
  getUserRoom,
} from "../websocket.rooms";

import type {
  AppSocket,
  AppServer,
  SendMessagePayload,
  MessageSocketPayload,
} from "../websocket.types";

const messageServices =
  new MessageServices();

const serializeMessage = (
  message: {
    _id: { toString(): string };
    conversation: { toString(): string };
    sender: { toString(): string };
    type: "text";
    content: string;
    status: "sent" | "delivered" | "read";
    createdAt: Date;
    updatedAt: Date;
  }
): MessageSocketPayload => {
  return {
    _id: message._id.toString(),

    conversation:
      message.conversation.toString(),

    sender:
      message.sender.toString(),

    type: message.type,

    content: message.content,

    status: message.status,

    createdAt: message.createdAt,

    updatedAt: message.updatedAt,
  };
};

export const registerMessageHandlers = (
  io: AppServer,
  socket: AppSocket
): void => {
  socket.on(
    SocketEvent.MESSAGE_SEND,
    async (
      data: SendMessagePayload,
      callback
    ) => {
      try {
        const message =
          await messageServices.createMessage(
            socket.data.user.id,
            data.conversationId,
            data.content
          );

        const messagePayload =
          serializeMessage(message);

        callback?.({
          success: true,
          data: {
            message: messagePayload,
          },
        });

        io.to(
          getConversationRoom(
            data.conversationId
          )
        ).emit(
          SocketEvent.MESSAGE_NEW,
          messagePayload
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to send message";

        callback?.({
          success: false,
          error: message,
        });

        socket.emit(
          SocketEvent.ERROR,
          {
            message,
          }
        );
      }
    }
  );
};