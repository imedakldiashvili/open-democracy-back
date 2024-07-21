import { Router } from "express";
import BanksContoller from "../controllers";



const bankRouter = Router();

bankRouter.post("/banks/accounts", BanksContoller.findBankAccounts)
bankRouter.post("/banks/bognewtoken", BanksContoller.NewBOGToken)
bankRouter.post("/banks/bogtodaysactivities/:account", BanksContoller.BOGTodaysActivities)
bankRouter.post("/banks/bogtransactionprocesing", BanksContoller.BOGTransactionProcesing)



export default bankRouter;