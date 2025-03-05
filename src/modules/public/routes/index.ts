import { Router } from "express";
import PublicControler from "../controllers";


const publicRouter = Router();


publicRouter.post("/public/bankAccounts", PublicControler.findBankAccounts)

publicRouter.post("/public/electionsdetail", PublicControler.findElectionsDetail)

publicRouter.post("/public/elections", PublicControler.findElections)
publicRouter.post("/public/electionsvotingcards", PublicControler.findElectionsVingCards)

publicRouter.post("/public/donations", PublicControler.findDonations)
publicRouter.post("/public/supporters", PublicControler.finSupporters)
publicRouter.post("/public/delegates", PublicControler.findDelegates)
publicRouter.post("/public/delegatesgroups", PublicControler.findDelegatesGroups)

publicRouter.post("/public/createElection", PublicControler.createElection)



export default publicRouter;