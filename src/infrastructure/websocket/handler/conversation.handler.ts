import ConversationServices from "../../../modules/conversations/conversation.services";
import { SocketEvent } from "../websocket.events";
import { getConversationRoom } from "../websocket.rooms";
import type { AppSocket, ConversationRoomPayload } from "../websocket.types";

const conversationServices = new ConversationServices();

export const registerConversationHandlers = (socket: AppSocket): void => {
  socket.on(
    SocketEvent.CONVERSATION_JOIN,
    async (data: ConversationRoomPayload) => {
      console.log('data.conversationId', data)
      try {
        await conversationServices.getConversationById(
          data.conversationId,
          socket.data.user.id,
        );

        await socket.join(getConversationRoom(data.conversationId));
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to join conversation";

        socket.emit(SocketEvent.ERROR, {
          message,
        });
      }
    },
  );

  socket.on(
    SocketEvent.CONVERSATION_LEAVE,
    async (data: ConversationRoomPayload) => {
      socket.leave(getConversationRoom(data.conversationId));
    },
  );
};
