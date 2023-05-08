import { appDataSource } from "../../../datasources"
import { Ballot, BallotItem, BallotType } from "../entities";

export const ballotRepository = appDataSource.getRepository(Ballot);
export const ballotItemRepository = appDataSource.getRepository(BallotItem);
export const ballotTypeRepository = appDataSource.getRepository(BallotType);


