import { appDataSource } from "../../../datasources"
import { Action, ActionType } from "../entities";



export const actionRepository = appDataSource.getRepository(Action);
export const actionTypeRepository = appDataSource.getRepository(ActionType);