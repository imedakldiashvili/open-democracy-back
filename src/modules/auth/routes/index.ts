import AuthController  from "../controllers";

export { AuthController }

import { Router } from "express";


const authRouter = Router();

authRouter.post("/auth/signUpOTP", AuthController.signUpOTP)
authRouter.post("/auth/signUp", AuthController.signUp)

authRouter.post("/auth/signIn", AuthController.signIn)

authRouter.post("/auth/signOut", AuthController.signOut)



export default authRouter;