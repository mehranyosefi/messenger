import { Router } from "express";
import userRouter from "./userRoutes"
import {
  signup,
  login,
  refreshToken,
  getMe,
} from "../controllers/AuthController";
import protect from "../middleware/authMiddleware";


const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World from TypeScript project structure!");
});

router.use("/users", userRouter)

router.post("/signup", signup);

router.post("/login", login);

router.post("/refresh", refreshToken);

router.get("/me", protect, getMe);


export default router;