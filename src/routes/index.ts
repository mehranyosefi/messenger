import { Router } from "express";
import protect from "../middleware/protectMiddleware";
import AuthController from "../modules/auth/auth.controller";
//routes
import userRoutes from "../modules/users/user.routes";
import contactRoutes from "../modules/contacts/contact.routes";
import conversationRoutes from "../modules/conversations/conversation.routes";
import messageRoutes from "../modules/messages/message.routes";

const router = Router();
const authController = new AuthController();

router.get("/", (req, res) => {
  res.send("Hello World from TypeScript project structure!");
});

//users
router.use("/users", userRoutes);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

router.get("/me", protect, authController.getMe);

//contacts
router.use("/contacts", contactRoutes);
//conversations
router.use("/conversations", conversationRoutes);
//messages
router.use("/messages", messageRoutes);

export default router;
