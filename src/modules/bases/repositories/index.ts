import { appDataSource } from "../../../datasources"
import { Ballot, BallotItem, BallotType, District, PollingStation, Region, Voter } from "../entities";

export const ballotRepository = appDataSource.getRepository(Ballot);
export const ballotItemRepository = appDataSource.getRepository(BallotItem);
export const ballotTypeRepository = appDataSource.getRepository(BallotType);

export const districtRepository = appDataSource.getRepository(District);
export const pollingStationRepository = appDataSource.getRepository(PollingStation);
export const regionRepository = appDataSource.getRepository(Region);
export const voterRepository = appDataSource.getRepository(Voter);

