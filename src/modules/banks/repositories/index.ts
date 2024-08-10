import { appDataSource } from "../../../datasources"

import { BankSetting } from "../entities/BankSetting";
import { BankToken } from "../entities/BankToken";

export const bankSettingRepository = appDataSource.getRepository(BankSetting);
export const bankTokenRepository = appDataSource.getRepository(BankToken);
