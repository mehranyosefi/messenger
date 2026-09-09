import { Router } from "express";
//routes
import userRoutes from "../modules/users/userRoutes"
import {
  signup,
  login,
  refreshToken,
  getMe,
} from "../modules/auth/AuthController";
import contactRoutes from "../modules/contacts/contact.routes"
import protect from "../middleware/protectMiddleware"



const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World from TypeScript project structure!");
});

//users routes
router.use("/users", userRoutes)

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);

router.get("/me", protect, getMe);

//contacts routes

router.use("/contacts", contactRoutes);



export default router;