import { Router } from "express";

import { OtpController, UserInivitationController, UserVerificationController } from "../controllers";

import UserController from "../controllers/UserController";
import UserDelegateController from "../controllers/UserDelegateController";

const userRouter = Router();

userRouter.post("/otps/add", OtpController.addOTP)
userRouter.post("/otps/check", OtpController.checkOTP)


userRouter.post("/Users/refreshsession", UserController.refreshSession)
userRouter.post("/Users/passwordChange", UserController.passwordChange)
userRouter.post("/users/signOut", UserController.signOut)

userRouter.post("/UsersInivitations/add", UserInivitationController.add)
userRouter.post("/UsersInivitations/findBySender", UserInivitationController.findBySender)
userRouter.post("/UsersInivitations/findActive", UserInivitationController.findActiveByEmailPersonalId)

userRouter.post("/Users/verification", UserVerificationController.verification)
userRouter.post("/Users/setLocation", UserVerificationController.setLocation)

userRouter.post("/Users/setDelegate", UserDelegateController.setDelagate)







export default userRouter;