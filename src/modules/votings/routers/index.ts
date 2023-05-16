import * as express from "express";
import VoterController from "../controllers";

const voterRouter = express.Router();

voterRouter.post("/votings/findVoter", VoterController.findVoter)
voterRouter.post("/votings/findOne", VoterController.findOneVoter)

voterRouter.post("/votings/newVotingCard", VoterController.newVotingCard)
voterRouter.post("/votings/votingCard", VoterController.votingCard)

voterRouter.post("/votings/postVote", VoterController.vote)


export default voterRouter;