import { appDataSource } from "../../../datasources"
import { Ballot, BallotItem, BallotType, BallotItemValue } from "../entities";
import { BallotItemSubject } from "../entities/BallotItemSubject";

export const ballotRepository = appDataSource.getRepository(Ballot);
export const ballotItemRepository = appDataSource.getRepository(BallotItem);
export const ballotItemValueRepository = appDataSource.getRepository(BallotItemValue);
export const ballotTypeRepository = appDataSource.getRepository(BallotType);
export const ballotItemSubjectRepository = appDataSource.getRepository(BallotItemSubject);

