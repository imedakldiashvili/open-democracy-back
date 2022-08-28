import { appDataSource } from "../../../datasources"
import { BallotType, District, PollingStation, Region, Voter } from "../entities";


export const ballotTypeRepository = appDataSource.getRepository(BallotType);
export const districtRepository = appDataSource.getRepository(District);
export const pollingStationRepository = appDataSource.getRepository(PollingStation);
export const regionRepository = appDataSource.getRepository(Region);
export const voterRepository = appDataSource.getRepository(Voter);