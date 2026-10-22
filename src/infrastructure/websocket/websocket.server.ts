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
      origin: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["token", "Authorization", "Content-Type"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.engine.on("initial_headers", (headers, req) => {
    console.log(
      ">>> Engine.IO Handshake Started from IP:",
      req.socket.remoteAddress,
    );
  });

  io.use(socketAuthMiddleware);

  io.on(SocketEvent.CONNECTION, (socket: AppSocket) => {
    const userId = socket.data.user.id;

    socket.join(getUserRoom(userId));
    console.log("tes");
    registerMessageHandlers(io, socket);
    registerConversationHandlers(socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};
