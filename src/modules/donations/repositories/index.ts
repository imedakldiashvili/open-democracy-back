import { appDataSource } from "../../../datasources"

import { BankTransaction } from "../entities";

export const BankTransactionRepository = appDataSource.getRepository(BankTransaction);
