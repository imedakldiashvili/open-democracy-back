import { appDataSource } from "../../../datasources"
import { Voter } from "../entities";


export const voterRepository = appDataSource.getRepository(Voter);

