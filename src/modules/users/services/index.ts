
import { AppError, throwBadRequest } from "../../../middlewares/error";
import { generateHash, generateRefreshToken, generateToken } from "../../../middlewares/security";

import { dateNow, dateNowAddMinutes, newGuid, otpCode } from "../../../utils";

import { UserDetail, UserInivitation, UserOTP, UserSession } from "../entities";
import { userDetailRepository, userInivitationRepository, userOTPRepository, userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { LessThan, MoreThan } from "typeorm";
import { serviceAddUserInivitaionAction } from "../../actions/services";


export const getLoginUser = async (loginEmail: string) => {

    const email = loginEmail.toLocaleLowerCase();
    const loginUser = await userRepository.findOne({
        where: { email: email }
    })

    if (loginUser === null) {
        throw AppError.notFound(`user_with_email_not_found`);
    }

    return loginUser
}

export const checkPassword = async (loginUserId: number, password: string) => {

    const userPasswords = await userPasswordRepository.find({
        where: { userId: loginUserId },
        order: { id: -1 }
    })

    if (userPasswords.length === 0) {
        throw AppError.notFound(`password_not_Found`);
    }
    const userPassword = userPasswords[0]

    const isAuthorized = (userPassword.passwordHash === generateHash(password, userPassword.passwordSalt))
    if (!isAuthorized) {
        throw AppError.forbidden(`wrong_password`);
    }

    return userPassword
}

export const loginUserService = async (deviceUid: string, email: string, password: string) => {

    const loginEmail = email.toLocaleLowerCase();
    const loginUser = await getLoginUser(loginEmail)

    const userPassword = await checkPassword(loginUser.id, password)
    const passwordIsTemporary = userPassword.isTemporary

    var result = await createSession(loginUser, deviceUid, passwordIsTemporary)

    return result
}

export const createSession = async (loginUser: any, deviceUid: string, passwordIsTemporary: boolean) => {

    const sessionUid = newGuid()

    const voters = await userDetailRepository.find({
        where: { id: loginUser.id },
        relations: { district: true }
    })
    const voter = voters.length == 1 ? voters[0] : null
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
        session: {
            deviceUid: loginSesion.deviceUid,
            sessionUid: newSession.sessionUid,
            passwordIsTemporary: passwordIsTemporary,
            voter: voter,
            user: loginUser
        },
        token: token,
        refershToken: refershToken
    });

}

export const refreshSessionService = async (loginUserId: number, deviceUid: string) => {

    const sessionUid = newGuid()

    const loginUser = await userRepository.findOne({ where: { id: loginUserId } })

    const userPasswords = await userPasswordRepository.find({
        where: { userId: loginUserId },
        order: { id: -1 }
    })

    if (userPasswords.length === 0) {
        throw AppError.notFound(`password_not_Found`);
    }
    const userPassword = userPasswords[0]

    const passwordIsTemporary = userPassword.isTemporary

    const voters = await userDetailRepository.find({
        where: { id: loginUserId },
        relations: { district: true }
    })

    const voter = voters.length == 1 ? voters[0] : null

    const newSession = new UserSession()
    newSession.deviceUid = deviceUid
    newSession.isActive = true
    newSession.createdAt = dateNow()
    newSession.sessionUid = sessionUid
    newSession.user = loginUser
    newSession.passwordIsTemporary = false
    const loginSesion = await userSessionRepository.save(newSession)


    return ({
        session: {
            deviceUid: loginSesion.deviceUid,
            sessionUid: newSession.sessionUid,
            passwordIsTemporary: passwordIsTemporary,
            voter: voter,
            user: loginUser
        }
    });

}

export const addOTP = async (deviceUid: string, type: string, value: string, createdBy: number) => {

    const exOtpCodes = await userOTPRepository.find({ where: { isActive: true, value: value, type: type } })

    for (const otpCode of exOtpCodes) {
        otpCode.isActive = false,
            otpCode.expirationDate = dateNow()
        await userOTPRepository.save(otpCode)
    }

    const otp = new UserOTP();
    otp.deviceUid = deviceUid
    otp.value = value
    otp.type = type
    otp.code = otpCode()
    otp.isActive = true,
        otp.createdBy = createdBy,
        otp.createdOn = dateNow();
    otp.expirationDate = dateNowAddMinutes(5)

    await userOTPRepository.save(otp)
    const result = { type: otp.type, value: otp.value, code: otp.code, status: "otp_send_successfuly" }
    return result
}

export const checkOTP = async (deviceUid: string, type: string, value: string, createdBy: number, code: number) => {

    const userOTPs = await userOTPRepository.find({ where: { createdBy: createdBy, isActive: true, value: value, type: type } })
    if (userOTPs.length == 0) { throwBadRequest("active_otp_code_not_found") }
    if (userOTPs.length > 1) { throwBadRequest("active_otp_code_more_that_one") }

    const userOTP = userOTPs[0]

    if (userOTP.deviceUid != deviceUid) { throwBadRequest("invalid_otp_device_uid") }
    if (userOTP.type != type) { throwBadRequest("invalid_otp_type") }
    if (userOTP.code != code) { throwBadRequest("invalid_otp_code") }
    if (userOTP.expirationDate < dateNow()) { throwBadRequest("otp_code_expired") }
    if (!userOTP.isActive) { throwBadRequest("otp_code_is_not_active") }

    userOTP.isActive = false
    userOTP.updatedOn = dateNow()

    await userOTPRepository.save(userOTP)
    const result = { id: userOTP.id, type: userOTP.type, value: userOTP.value, status: "otp_checked_successfuly" }
    return result
}

export const verification = async (deviceUid: string, personalId: string, email: string, directinId: number, userId: number) => {

    const inivitations = await userInivitationRepository.find({
        where: {
            personalId: personalId
            // , email: email
            , expireOn: MoreThan(dateNow())
            , statusId: 1
        }
    });

    if (inivitations.length != 1) { throwBadRequest("inivitation_not_found") }

    var inivitation = inivitations[0]
    inivitation.statusId = 2
    await userInivitationRepository.save(inivitation)

    var newUserDetail = new UserDetail()
    newUserDetail.id = userId
    newUserDetail.code = personalId;
    newUserDetail.fullName = inivitation.fullName
    newUserDetail.districtId = directinId
    newUserDetail.isActive = true
    newUserDetail.isDelegate = false
    await userDetailRepository.save(newUserDetail)

    var newSession = await refreshSessionService(userId, deviceUid);

    return newSession
}

export const addUserInivitation = async (personalId: string, fullName: string, mobile: string, email: string, createdBy: number, sessionUid: string) => {
    var exUsersByCode = await userRepository.find({ where: { userDetail: { code: personalId } } })
    if (exUsersByCode.length) { return }
    
    var exUserInivitations = await userInivitationRepository.find({where: {statusId: 1, personalId: personalId }});

    for (var exUserInivitation of exUserInivitations) {
        exUserInivitation.statusId = -1
        await userInivitationRepository.save(exUserInivitation);
    }

    const createdUserId = createdBy
    const newUserInivitation = new UserInivitation();
    newUserInivitation.createdUserId = createdUserId
    newUserInivitation.personalId = personalId,
    newUserInivitation.fullName = fullName,
    newUserInivitation.email = email
    newUserInivitation.expireOn = dateNowAddMinutes(2 * 24 * 60);
    newUserInivitation.statusId = 1

    await userInivitationRepository.save(newUserInivitation);

    const inivitaitaionId = newUserInivitation.id;

    await serviceAddUserInivitaionAction({ sessionUid, inivitaitaionId, createdUserId, personalId, fullName, email, mobile })

    return newUserInivitation;
};