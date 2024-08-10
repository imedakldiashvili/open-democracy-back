import { Router } from "express";
import BanksContoller from "../controllers";



const bankRouter = Router();

bankRouter.post("/banks/accounts", BanksContoller.findBankAccounts)

bankRouter.post("/banks/bognewtoken", BanksContoller.BOGNewToken)
bankRouter.post("/banks/bogtodaysactivities", BanksContoller.BOGTodaysActivities)
bankRouter.post("/banks/bogtransactionprocesing", BanksContoller.BOGTransactionProcesing)

bankRouter.post("/banks/tbcnewpassword", BanksContoller.TBCNewPassword)
bankRouter.post("/banks/tbcaccountmovements", BanksContoller.TBCAccountMovements)
bankRouter.post("/banks/tbctransactionprocesing", BanksContoller.TBCTransactionProcesing)



export default bankRouter;