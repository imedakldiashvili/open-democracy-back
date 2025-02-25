import * as express from "express";
import { VoterController, VotingCardController } from "../controllers";



const voterRouter = express.Router();



voterRouter.post("/votingCards/findDetail", VotingCardController.findDetail)
voterRouter.post("/votingCards/findUserActiveVotingCards", VotingCardController.findUserActiveVotingCards)
voterRouter.post("/votingCards/findUserAllVotingCards", VotingCardController.findUserAllVotingCards)



voterRouter.post("/votings/findUserSessionVotingCards", VoterController.findUserSessionVotingCards)
voterRouter.post("/votings/findUserSessionNewVotingCards", VoterController.findUserSessionNewVotingCards)
voterRouter.post("/votings/findElectionVotingCards", VoterController.findElectionVotingCards)

voterRouter.post("/votings/findVoter", VoterController.findVoter)
voterRouter.post("/votings/findOne", VoterController.findOneVoter)

voterRouter.post("/votings/votingCard", VoterController.votingCard)

voterRouter.post("/votings/postVote", VoterController.vote)




export default voterRouter;