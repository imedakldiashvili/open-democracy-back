import { appDataSource } from "../../../datasources"

import { BankBOGToken } from "../entities/BankBOGToken";

export const BankBOGTokenRepository = appDataSource.getRepository(BankBOGToken);