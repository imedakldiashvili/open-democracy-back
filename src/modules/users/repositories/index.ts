import { appDataSource } from "../../../datasources"
import { User, UserPassword } from "../entities";

export const userRepository = appDataSource.getRepository(User);
export const userPasswordRepository = appDataSource.getRepository(UserPassword);