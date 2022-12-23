import { Router } from "express";

import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.put("/users/edit", UserController.edit)

export default userRouter;