import * as express from "express";
import { ElectionControler } from "../controllers";


const electionRouter = express.Router();

electionRouter.post("/elections/findItems", ElectionControler.findItems)
electionRouter.post("/elections/findDetails", ElectionControler.findDetails)
electionRouter.post("/elections/findAll", ElectionControler.findAll)
electionRouter.post("/elections/findActiveByVoter", ElectionControler.findActiveByVoter)


electionRouter.post("/elections/create", ElectionControler.createElection)
electionRouter.post("/elections/publish", ElectionControler.publicElection)
electionRouter.post("/elections/process", ElectionControler.processElection)
electionRouter.post("/elections/complete", ElectionControler.completeElection)
electionRouter.post("/elections/calculateVotedValue", ElectionControler.calculateVotedValueElection)


export default electionRouter;