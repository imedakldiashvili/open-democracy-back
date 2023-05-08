import { appDataSource } from "../../../datasources"
import { Currency } from "../entities";

export const currencyRepository = appDataSource.getRepository(Currency);