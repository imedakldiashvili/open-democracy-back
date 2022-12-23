import { Router } from "express";
import { AuthController }  from "../controllers";

const authRouter = Router();

authRouter.post("/auth/signEmail", AuthController.signEmail)
authRouter.post("/auth/signUp", AuthController.signUp)
authRouter.post("/auth/signIn", AuthController.signIn)
authRouter.post("/auth/signOut", AuthController.signOut)

export default authRouter;