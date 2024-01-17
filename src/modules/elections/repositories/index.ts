import { appDataSource } from "../../../datasources"


import { Election } from "../entities";
import { ElectionStatus } from "../entities";
import { ElectionStatusSchedule } from "../entities/ElectionStatusSchedule";


export const electionRepository = appDataSource.getRepository(Election);
export const electionStatusRepository = appDataSource.getRepository(ElectionStatus);
export const electionStatusScheduleRepository = appDataSource.getRepository(ElectionStatusSchedule);