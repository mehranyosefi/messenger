import { Router } from "express";
import UserController from "./UserController";

const router = Router();

const userController = new UserController()

router.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

export default router