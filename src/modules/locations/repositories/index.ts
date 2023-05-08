import { appDataSource } from "../../../datasources"
import { District, PollingStation, Region } from "../entities";


export const districtRepository = appDataSource.getRepository(District);
export const pollingStationRepository = appDataSource.getRepository(PollingStation);
export const regionRepository = appDataSource.getRepository(Region);

