import { appDataSource } from "../../../datasources"
import { Otp } from "../entities";

export const otpRepository = appDataSource.getRepository( Otp );