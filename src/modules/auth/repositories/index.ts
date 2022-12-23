import { appDataSource } from "../../../datasources"

import { User, UserPassword, UserSession } from "../../users/entities";

export const userRepository = appDataSource.getRepository(User);
export const userPasswordRepository = appDataSource.getRepository(UserPassword);
export const userSessionRepository = appDataSource.getRepository(UserSession);

