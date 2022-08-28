import { appDataSource } from "../../../datasources"
import { Election } from "../entities";
import { ElectionBallot } from "../entities/ElectionBallot";
import { ElectionBallotItem } from "../entities/ElectionBallotItem";


export const electionRepository = appDataSource.getRepository(Election);
export const electionBallotRepository = appDataSource.getRepository(ElectionBallot);
export const electionBallotItemRepository = appDataSource.getRepository(ElectionBallotItem);