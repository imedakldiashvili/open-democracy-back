import * as express from "express";
import { ElectionControler } from "../controllers";


const electionRouter = express.Router();

electionRouter.post("/elections/findItems", ElectionControler.findItems)
electionRouter.post("/elections/findDetails", ElectionControler.findDetails)
electionRouter.post("/elections/findAll", ElectionControler.findAll)


electionRouter.post("/elections/create", ElectionControler.createElection)
electionRouter.post("/elections/publish", ElectionControler.publicElection)
electionRouter.post("/elections/process", ElectionControler.processElection)

export default electionRouter;