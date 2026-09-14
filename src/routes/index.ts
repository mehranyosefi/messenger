import { Router } from "express";
//routes
import userRoutes from "../modules/users/user.routes"
import AuthController from "../modules/auth/auth.controller";
import contactRoutes from "../modules/contacts/contact.routes"
import protect from "../middleware/protectMiddleware"



const router = Router();
const authController = new AuthController()

router.get("/", (req, res) => {
  res.send("Hello World from TypeScript project structure!");
});

//users routes
router.use("/users", userRoutes)

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

router.get("/me", protect, authController.getMe);

//contacts routes
router.use("/contacts", contactRoutes);



export default router;