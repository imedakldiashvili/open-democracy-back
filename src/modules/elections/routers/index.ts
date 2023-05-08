import * as express from "express";
import { ElectionControler } from "../controllers";


const electionRouter = express.Router();

electionRouter.post("/elections/findAll", ElectionControler.findAllElections)
electionRouter.post("/elections/findActives", ElectionControler.findActiveElections)
electionRouter.post("/elections/findOne", ElectionControler.findOneElection)
electionRouter.post("/elections/Add", ElectionControler.addElection)
electionRouter.put("/elections/SetActiveElection", ElectionControler.setActiveElection)
electionRouter.delete("/elections/Remove", ElectionControler.deleteElection)

export default electionRouter;