//  Create and configure Socket.IO
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./websocket.auth";
import { SocketEvent } from "./websocket.events";
import { getUserRoom } from "./websocket.rooms";
import { registerMessageHandlers } from "./handler/message.handler";
import { registerConversationHandlers } from "./handler/conversation.handler";

import type {
  AppServer,
  AppSocket,
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./websocket.types";

export const createWebSocketServer = (httpServer: HttpServer): AppServer => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL ?? "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on(SocketEvent.CONNECTION, (socket: AppSocket) => {
    const userId = socket.data.user.id;
    /**
     * Every socket belonging to this user
     * joins the user's personal room.
     */
    socket.join(getUserRoom(userId));

    registerMessageHandlers(io, socket);

    registerConversationHandlers(socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};
