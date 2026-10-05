 //Authenticate JWT during socket connection
 import type {
  ExtendedError,
} from "socket.io";

import type { AppSocket } from "./websocket.types";

import { verifyAccessToken } from "../../utils/jwt";

export const socketAuthMiddleware = (
  socket: AppSocket,
  next: (err?: ExtendedError) => void
): void => {
  try {
    const token =
      socket.handshake.auth?.token;

    if (
      typeof token !== "string" ||
      token.length === 0
    ) {
      next(
        new Error(
          "Authentication token is required"
        )
      );

      return;
    }

    const payload =
      verifyAccessToken(token);

    socket.data.user = {
      id: payload.id,
    };

    next();
  } catch {
    next(
      new Error(
        "Invalid or expired authentication token"
      )
    );
  }
};