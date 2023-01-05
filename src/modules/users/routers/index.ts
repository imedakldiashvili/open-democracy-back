import { Router } from "express";

import { AuthController } from "../controllers";

import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/auth/signUpEmailOTP", AuthController.signUpEmailOTP)
userRouter.post("/auth/signUp", AuthController.signUp)
userRouter.post("/auth/signIn", AuthController.signIn)
userRouter.post("/auth/signInLocal", AuthController.signInLocal)
userRouter.post("/auth/signOut", AuthController.signOut)

userRouter.put("/users/edit", UserController.edit)

export default userRouter;