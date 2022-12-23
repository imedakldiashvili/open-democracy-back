import { appDataSource } from "../../../datasources"


import { Election } from "../entities";



export const electionRepository = appDataSource.getRepository(Election);