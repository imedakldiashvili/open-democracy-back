import * as express from "express";
import { ElectionControler } from "../controllers";


const electionRouter = express.Router();

electionRouter.post("/elections/findItems", ElectionControler.findItemsElections)
electionRouter.post("/elections/findDetails", ElectionControler.findDetailsElections)

electionRouter.post("/elections/findAll", ElectionControler.findAllElections)
electionRouter.post("/elections/findActives", ElectionControler.findActiveElections)
electionRouter.post("/elections/findOne", ElectionControler.findOneElection)

electionRouter.post("/elections/Add", ElectionControler.addElection)
electionRouter.put("/elections/SetActive", ElectionControler.setActiveElection)
electionRouter.delete("/elections/Remove", ElectionControler.deleteElection)

electionRouter.post("/elections/create", ElectionControler.createElection)
electionRouter.post("/elections/process", ElectionControler.processElection)
electionRouter.post("/elections/publish", ElectionControler.publicElection)

export default electionRouter;