import { Router } from "express";

import { OtpController, UserInivitationController } from "../controllers";

import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/otps/add", OtpController.addOTP)
userRouter.post("/otps/check", OtpController.checkOTP)


userRouter.put("/users/edit", UserController.edit)

userRouter.post("/UsersInivitations/add", UserInivitationController.add)
userRouter.post("/UsersInivitations/findBySender", UserInivitationController.findBySender)


export default userRouter;