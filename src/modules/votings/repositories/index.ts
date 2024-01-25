import { appDataSource } from "../../../datasources"
import { VoteBallotItem, VoteBallotItemValue, VotingCard, VotingCardBallot } from "../entities";
import { BallotBox,  } from "../entities/BallotBox";

export const ballotBoxRepository = appDataSource.getRepository(BallotBox);
export const voteBallotItemRepository = appDataSource.getRepository(VoteBallotItem);
export const votegBallotItemValueRepository = appDataSource.getRepository(VoteBallotItemValue);
export const votingCardRepository = appDataSource.getRepository(VotingCard);
export const votingCardBallotRepository = appDataSource.getRepository(VotingCardBallot);

