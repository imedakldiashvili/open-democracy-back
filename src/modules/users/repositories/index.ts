import { appDataSource } from "../../../datasources"
import { User, UserPassword, UserSession, UserOTP, UserInivitation } from "../entities";



export const userRepository = appDataSource.getRepository(User);
export const userPasswordRepository = appDataSource.getRepository(UserPassword);
export const userSessionRepository = appDataSource.getRepository(UserSession);
export const userOTPRepository = appDataSource.getRepository( UserOTP );
export const userInivitationRepository = appDataSource.getRepository(UserInivitation);
