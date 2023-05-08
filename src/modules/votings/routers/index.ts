import * as express from "express";
import VoterController from "../controllers";



const voterRouter = express.Router();

voterRouter.post("/voters/findVoter", VoterController.findVoter)


export default voterRouter;