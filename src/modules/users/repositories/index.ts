import { appDataSource } from "../../../datasources"
import { User, UserPassword, UserSession } from "../entities";



export const userSessionRepository = appDataSource.getRepository(UserSession);
export const userRepository = appDataSource.getRepository(User);
export const userPasswordRepository = appDataSource.getRepository(UserPassword);