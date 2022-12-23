import { AppError } from "../../../middlewares/error";
import { generatePasswordHash, generateRefreshToken, generateToken } from "../../../middlewares/security";
import { dateNow, newGuid } from "../../../utils";

import { UserSession } from "../../users/entities";
import { userPasswordRepository, userRepository, userSessionRepository } from "../repositories";

    export const  loginUserService = async (deviceUid: string, email: string, password: string) => {

        const loginEmail = email;
        const loginUser = await userRepository.findOne({
            where: { email: loginEmail }
        })

        if (loginUser === null) {
            throw AppError.notFound(`user_with_email_not_found`);
        }

        const userPasswords = await userPasswordRepository.find({
            where: { userId: loginUser.id },
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


        const isTemporary = userPassword.isTemporary

        const sessionUid = newGuid()

        const newSession = new UserSession()
        newSession.deviceUid = deviceUid
        newSession.isActive = true
        newSession.createdAt = dateNow()
        newSession.sessionUid = sessionUid
        newSession.user = loginUser

        const loginSesion = await userSessionRepository.save(newSession)

        const token = generateToken(loginSesion)
        const refershToken = null // generateRefreshToken(loginSesion)

        return ({
            user: newSession.user,
            isTemporary: isTemporary,
            token: token,
            refershToken: refershToken
        });
    }