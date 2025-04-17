import { appDataSource } from "../../../datasources"
import { Ballot, BallotItem, BallotType, BallotItemValue } from "../entities";
import { BallotItemSubject } from "../entities/BallotItemSubject";
import { BallotItemValueVote } from "../entities/BallotItemValueVote";

export const ballotRepository = appDataSource.getRepository(Ballot);
export const ballotItemRepository = appDataSource.getRepository(BallotItem);
export const ballotItemValueRepository = appDataSource.getRepository(BallotItemValue);
export const ballotItemValueVoteRepository = appDataSource.getRepository(BallotItemValueVote);
export const ballotTypeRepository = appDataSource.getRepository(BallotType);
export const ballotItemSubjectRepository = appDataSource.getRepository(BallotItemSubject);

