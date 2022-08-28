import * as express from "express";
import { ElectionControler, ElectionBallotControler } from "../controllers";


const electionRouter = express.Router();

electionRouter.get("/Elections", ElectionControler.getElection)
electionRouter.get("/Elections/:id", ElectionControler.getElectionById)
electionRouter.post("/Elections", ElectionControler.addElection)
electionRouter.put("/Elections", ElectionControler.editElection)
electionRouter.put("/Elections/Active", ElectionControler.setActiveElection)
electionRouter.delete("/Elections", ElectionControler.deleteElection)


electionRouter.get("/ElectionsBallots", ElectionBallotControler.getElectionBallot)
electionRouter.get("/ElectionsBallots/ByElection/:electionId", ElectionBallotControler.getElectionBallotByElectionId)
electionRouter.get("/ElectionsBallots/:id", ElectionBallotControler.getElectionBallotById)
electionRouter.post("/ElectionsBallots", ElectionBallotControler.addElectionBallot)
electionRouter.put("/ElectionsBallots", ElectionBallotControler.editElectionBallot)
electionRouter.put("/ElectionsBallots/Active", ElectionBallotControler.setActiveElectionBallot)
electionRouter.delete("/ElectionsBallots", ElectionBallotControler.deleteElectionBallot)

export default electionRouter;