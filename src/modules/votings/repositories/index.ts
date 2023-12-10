import { appDataSource } from "../../../datasources"
import { Voter, VotingBallotItem, VotingBallotItemValue, VotingCard, VotingCardBallot } from "../entities";
import { BallotBox,  } from "../entities/BallotBox";

export const ballotBoxRepository = appDataSource.getRepository(BallotBox);
export const voterRepository = appDataSource.getRepository(Voter);
export const votingBallotItemRepository = appDataSource.getRepository(VotingBallotItem);
export const votingBallotItemValueRepository = appDataSource.getRepository(VotingBallotItemValue);
export const votingCardRepository = appDataSource.getRepository(VotingCard);
export const votingCardBallotRepository = appDataSource.getRepository(VotingCardBallot);

