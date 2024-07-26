import { appDataSource } from "../../../datasources"
import { Vote, VoteBallotItem, VoteBallotItemValue, VotingCard, VotingCardBallot } from "../entities";
import { BallotBox,  } from "../entities/BallotBox";

export const ballotBoxRepository = appDataSource.getRepository(BallotBox);

export const voteRepository = appDataSource.getRepository(Vote);
export const voteBallotItemRepository = appDataSource.getRepository(VoteBallotItem);
export const votegBallotItemValueRepository = appDataSource.getRepository(VoteBallotItemValue);
export const votingCardRepository = appDataSource.getRepository(VotingCard);
export const votingCardBallotRepository = appDataSource.getRepository(VotingCardBallot);

