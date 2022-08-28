import { appDataSource } from "../../../datasources"
import { Election } from "../entities";
import { ElectionBallot } from "../entities/ElectionBallot";


export const electionRepository = appDataSource.getRepository(Election);
export const electionBallotRepository = appDataSource.getRepository(ElectionBallot);
