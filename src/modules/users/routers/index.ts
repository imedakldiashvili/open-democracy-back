import { Router } from "express";

import { OtpController, AuthController } from "../controllers";

import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/auth/signUpOTP", AuthController.signUpOTP)
userRouter.post("/auth/signUp", AuthController.signUp)

userRouter.post("/auth/signIn", AuthController.signIn)

userRouter.post("/auth/signOut", AuthController.signOut)

userRouter.post("/otps/add", OtpController.addOTP)
userRouter.post("/otps/check", OtpController.checkOTP)


userRouter.put("/users/edit", UserController.edit)


export default userRouter;