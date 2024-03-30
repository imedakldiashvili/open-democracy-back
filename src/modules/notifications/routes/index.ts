import * as express from "express";
import SendNotification from "../controllers/SendNotification";



const notificationRouter = express.Router();

notificationRouter.post("/notifications/sendMail", SendNotification.sendMail)
notificationRouter.post("/notifications/sendSms", SendNotification.sendSms)

export default  notificationRouter;