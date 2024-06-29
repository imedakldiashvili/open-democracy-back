import { Router } from "express";
import BanksContoller from "../controllers";



const bankRouter = Router();

bankRouter.post("/banks/newbogtoken", BanksContoller.NewBOGToken)
bankRouter.post("/banks/todaysactivities/:account", BanksContoller.BOGTodaysActivities)




export default bankRouter;