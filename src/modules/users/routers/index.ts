import { Router } from "express";

import { OtpController, UserInivitationController, UserVerificationController } from "../controllers";

import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/otps/add", OtpController.addOTP)
userRouter.post("/otps/check", OtpController.checkOTP)

userRouter.post("/Users/refreshsession", UserController.refreshSession)
userRouter.post("/users/signOut", UserController.signOut)
userRouter.put("/users/edit", UserController.edit)

userRouter.post("/UsersInivitations/add", UserInivitationController.add)
userRouter.post("/UsersInivitations/findBySender", UserInivitationController.findBySender)
userRouter.post("/UsersInivitations/findActive", UserInivitationController.findActiveByEmailPersonalId)

userRouter.post("/Users/verification", UserVerificationController.verification)




export default userRouter;