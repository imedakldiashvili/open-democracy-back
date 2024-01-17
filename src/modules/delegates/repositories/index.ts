import { appDataSource } from "../../../datasources"


import { Delegate } from "../entities/Delegate";
import { DelegateGroup } from "../entities/DelegateGroup";


export const delegateRepository = appDataSource.getRepository(Delegate);
export const delegateGroupRepository = appDataSource.getRepository(DelegateGroup);