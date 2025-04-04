import { Router } from "express";

import { OtpController, UserInivitationController, UserVerificationController } from "../controllers";

import UserController from "../controllers/UserController";
import UserDelegateController from "../controllers/UserDelegateController";

const userRouter = Router();

userRouter.post("/otps/add", OtpController.addOTP)
userRouter.post("/otps/check", OtpController.checkOTP)

userRouter.post("/Users/refreshsession", UserController.refreshSession)
userRouter.post("/Users/session", UserController.session)

userRouter.post("/users/signOut", UserController.signOut)

userRouter.post("/Users/changePasswordOtp", UserController.changePasswordOtp)
userRouter.post("/Users/changePassword", UserController.changePassword)

userRouter.post("/Users/changeMobileOtp", UserController.changeMobileOtp)
userRouter.post("/Users/changeMobile", UserController.changeMobile)

userRouter.post("/Users/verificationCheck", UserVerificationController.verificationCheck)
userRouter.post("/Users/verificationOTP", UserVerificationController.verificationOTP)
userRouter.post("/Users/verification", UserVerificationController.verification)

userRouter.post("/UsersInivitations/add", UserInivitationController.add)
userRouter.post("/UsersInivitations/findBySender", UserInivitationController.findBySender)
userRouter.post("/UsersInivitations/findActive", UserInivitationController.findActiveByEmailPersonalId)

userRouter.post("/Users/setLocation", UserVerificationController.setLocation)
userRouter.post("/Users/setDelegate", UserDelegateController.setDelagate)







export default userRouter;