import { AppError } from "../../../middlewares/error";
import { generatePasswordHash, generateRefreshToken, generateToken } from "../../../middlewares/security";
import { dateNow, newGuid } from "../../../utils";

import { UserSession } from "../entities";
import { userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";

    export const  getLoginUser = async (loginEmail: string) => {

        const email = loginEmail.toLocaleLowerCase();
        const loginUser = await userRepository.findOne({
            where: { email: email}
        })

        if (loginUser === null) {
            throw AppError.notFound(`user_with_email_not_found`);
        }

        return loginUser
    }

    export const  checkPassword = async (loginUserId: number, password: string) => {

        const userPasswords = await userPasswordRepository.find({
            where: { userId: loginUserId },
            order: { id: -1 }
        })

        if (userPasswords.length === 0) {
            throw AppError.notFound(`password_not_Found`);
        }
        const userPassword = userPasswords[0]

        const isAuthorized = (userPassword.passwordHash === generatePasswordHash(password, userPassword.passwordSalt))
        if (!isAuthorized) {
            throw AppError.forbidden(`wrong_password`);
        }

        return userPassword
    }

    export const  createSession = async (loginUser: any, deviceUid: string, passwordIsTemporary: boolean) => {
        const sessionUid = newGuid()

        const newSession = new UserSession()
        newSession.deviceUid = deviceUid
        newSession.isActive = true
        newSession.createdAt = dateNow()
        newSession.sessionUid = sessionUid
        newSession.user = loginUser
        newSession.passwordIsTemporary = passwordIsTemporary
        const loginSesion = await userSessionRepository.save(newSession)

        const token = generateToken(loginSesion)
        const refershToken = null // generateRefreshToken(loginSesion)

        return ({
            session: newSession,
            token: token,
            refershToken: refershToken
        });
    }

    export const  loginUserService = async (deviceUid: string, email: string, password: string) => {

        const loginEmail = email.toLocaleLowerCase();
        const loginUser = await getLoginUser(loginEmail)
        
        const userPassword = await checkPassword(loginUser.id, password)
        const passwordIsTemporary = userPassword.isTemporary

        var result = await createSession(loginUser, deviceUid, passwordIsTemporary)

        return result
    }

    