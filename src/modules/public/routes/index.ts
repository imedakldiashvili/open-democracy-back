import { Router } from "express";
import PublicControler from "../controllers";


const publicRouter = Router();

publicRouter.post("/public/actualelection", PublicControler.findElectionsActual)
publicRouter.post("/public/elections", PublicControler.findElections)
publicRouter.post("/public/donations", PublicControler.findDonations)
publicRouter.post("/public/supporters", PublicControler.finSupporters)
publicRouter.post("/public/delegates", PublicControler.findDelegates)
publicRouter.post("/public/delegatesgroups", PublicControler.findDelegatesGroups)


export default publicRouter;