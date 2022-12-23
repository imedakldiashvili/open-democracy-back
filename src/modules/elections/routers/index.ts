import * as express from "express";
import { ElectionControler } from "../controllers";


const electionRouter = express.Router();

electionRouter.get("/Elections", ElectionControler.getElection)
electionRouter.get("/Elections/:id", ElectionControler.getElectionById)
electionRouter.post("/Elections", ElectionControler.addElection)
electionRouter.put("/Elections/Active", ElectionControler.setActiveElection)
electionRouter.delete("/Elections", ElectionControler.deleteElection)

export default electionRouter;