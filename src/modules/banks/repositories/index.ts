import { appDataSource } from "../../../datasources"

import { BankBOGToken } from "../entities/BankBOGToken";
import { BankSetting } from "../entities/BankSrtting";

export const bankBOGTokenRepository = appDataSource.getRepository(BankBOGToken);
export const bankSettingRepository = appDataSource.getRepository(BankSetting);
