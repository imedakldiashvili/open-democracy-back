import * as express from "express";
import { OtpController} from "../controllers";

const otpRouter = express.Router();


otpRouter.post("/otps/add", OtpController.add)
otpRouter.put("/otps/check", OtpController.check)


export default otpRouter;