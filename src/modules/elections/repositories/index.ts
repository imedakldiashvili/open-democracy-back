import { appDataSource } from "../../../datasources"


import { Election } from "../entities";
import { ElectionStatus } from "../entities";
import { ElectionTimePeriod } from "../entities/ElectionTImesPeriods";


export const electionRepository = appDataSource.getRepository(Election);
export const electionStatusRepository = appDataSource.getRepository(ElectionStatus);
export const electionTimePeriodRepository = appDataSource.getRepository(ElectionTimePeriod);