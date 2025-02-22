
import { AppError, throwBadRequest } from "../../../middlewares/error";
import { generateHash, generateRefreshToken, generateToken } from "../../../middlewares/security";

import { dateNow, dateNowAddMinutes, newGuid, otpCode } from "../../../utils";

import { UserDetail, UserInivitation, UserOTP, UserPassword, UserPersonalId, UserSession } from "../entities";
import { userDetailRepository, userInivitationRepository, userOTPRepository, userPasswordRepository, userPersonalIdRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import { serviceAddUserInivitaionAction } from "../../actions/services";
import settings from "../../../settings";
import { sendMail } from "../../notifications/services";
import { sendSMS } from "../../notifications/smsApi";


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

export const addPassword = async (userId: number, password: string, createdUserId: number) => {

    var exPasswords = await userPasswordRepository.find({where: {isActive: true, userId: userId}})
    for( var exPassword of exPasswords )
    {
        exPassword.isActive = false
        await userPasswordRepository.save(exPassword)
    }
    
    const passwordSalt = newGuid();
    const passwordHash = generateHash(password,passwordSalt)
    const userPassword = new UserPassword()
    userPassword.userId = userId
    userPassword.passwordSalt = passwordSalt
    userPassword.passwordHash = passwordHash
    userPassword.isActive = true
    userPassword.isTemporary = false
    userPassword.createdBy = createdUserId
    userPassword.createdOn = new Date()
    
    await userPasswordRepository.save(userPassword)   

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

export const addOTP = async (target: string, deviceUid: string, type: string, value: string, createdBy: number) => {

    const exOtpCodes = await userOTPRepository.find({ where: { isActive: true, value: value, type: type } })

    for (const otpCode of exOtpCodes) {
        otpCode.isActive = false,
            otpCode.expirationDate = dateNow()
        await userOTPRepository.save(otpCode)
    }

    const otp = new UserOTP();
    otp.target = target
    otp.deviceUid = deviceUid
    otp.value = value
    otp.type = type
    otp.code = otpCode()
    otp.isActive = true
    otp.createdBy = createdBy
    otp.createdOn = dateNow()
    otp.expirationDate = dateNowAddMinutes(5)

    await userOTPRepository.save(otp)
    const result = { type: otp.type, value: otp.value, code: otp.code, status: "otp_send_successfuly" }
    return result
}

export const checkOTP = async (target: string, deviceUid: string, type: string, value: string, createdBy: number, code: number) => {

    const userOTPs = await userOTPRepository.find({ where: { createdBy: createdBy, isActive: true, value: value, type: type, target: target } })
    if (userOTPs.length == 0) { throwBadRequest("active_otp_code_not_found") }
    if (userOTPs.length > 1) { throwBadRequest("active_otp_code_more_that_one") }

    const userOTP = userOTPs[0]

    if (userOTP.deviceUid != deviceUid) { throwBadRequest("invalid_otp_device_uid") }
    if (userOTP.code != code) { throwBadRequest("invalid_otp_code") }
    if (userOTP.expirationDate < dateNow()) { throwBadRequest("otp_code_expired") }
    if (!userOTP.isActive) { throwBadRequest("otp_code_is_not_active") }

    userOTP.isActive = false
    userOTP.updatedOn = dateNow()

    await userOTPRepository.save(userOTP)
    const result = { id: userOTP.id, type: userOTP.type, value: userOTP.value, status: "otp_checked_successfuly" }
    return result
}

export const verification = async (deviceUid: string, personalId: string, fistName: string,  lastName: string, userId: number) => {

    const userPersonalIds = await userPersonalIdRepository.find({
        where: {
            personalId: personalId
            , statusId: 1
        }
    });

    if (userPersonalIds.length != 1) { throwBadRequest("user_personal_id_not_found") }

    var userPersonalId = userPersonalIds[0]
    userPersonalId.statusId = 2
    await userPersonalIdRepository.save(userPersonalId)

    var newUserDetail = new UserDetail()
    newUserDetail.id = userId
    newUserDetail.code = personalId;
    newUserDetail.firstName = fistName
    newUserDetail.lastName = lastName
    newUserDetail.fullName = userPersonalId.fullName
    newUserDetail.districtId = 0
    newUserDetail.isActive = true
    newUserDetail.isDelegate = false
    await userDetailRepository.save(newUserDetail)

    var newSession = await refreshSessionService(userId, deviceUid);

    return newSession
}

export const addUserInivitation = async (mobileNumber: string, fullName: string, email: string, createdBy: number, sessionUid: string) => {
    

    var exUsersByEmail = await userRepository.find({ where: { email: email } })
    if (exUsersByEmail.length) { { throwBadRequest("user_with_this_email_already_exists") } }
    
    const createdUserId = createdBy

    var exUserInivitations = await userInivitationRepository.find({where: {statusId: MoreThanOrEqual(0), createdUserId: createdBy,  email: email}});
    
    let inivitaitaionId = 0;

    const newUserInivitation = new UserInivitation();
    newUserInivitation.createdUserId = createdUserId
    newUserInivitation.mobileNumber = mobileNumber,
    newUserInivitation.fullName = fullName,
    newUserInivitation.email = email
    newUserInivitation.expireOn = dateNowAddMinutes(2 * 24 * 60);
    newUserInivitation.statusId = 1                
    await userInivitationRepository.save(newUserInivitation);
    inivitaitaionId = newUserInivitation.id;
    
    await serviceAddUserInivitaionAction({ sessionUid, inivitaitaionId, createdUserId, mobileNumber, fullName, email })
    return newUserInivitation;
    
};

export const addUserPersonalId = async (personalId: string, fullName: string, uid: string, createdBy: number, sessionUid: string, mobileNumber: string) => {
    
    if (personalId == null) { return }
    
    if (personalId.toString().length != 11) { return }

    var exUsersByCode = await userRepository.find({ where: { userDetail: { code: personalId } } })
    if (exUsersByCode.length) { return }
    
    const createdUserId = createdBy

    var exPersonalIds = await userPersonalIdRepository.find({where: {statusId: MoreThanOrEqual(0), personalId: personalId }});
    if (exPersonalIds.filter(e=> e.createdUserId == 1 && e.uid == uid).length) { return }

    let userPersonalId = 0;

    const newUserPersonalId = new UserPersonalId();
    newUserPersonalId.createdUserId = createdUserId
    newUserPersonalId.personalId = personalId,
    newUserPersonalId.fullName = fullName,
    newUserPersonalId.uid = uid
    newUserPersonalId.expireOn = dateNowAddMinutes(2 * 24 * 60);
    newUserPersonalId.statusId = 1   
    newUserPersonalId.mobileNumber = mobileNumber;             
    await userPersonalIdRepository.save(newUserPersonalId);
    userPersonalId = newUserPersonalId.id;

    const smsText = "welcome to primaries.ge: " + personalId + (mobileNumber ? " - " + mobileNumber : "");            
    if (mobileNumber) { await sendSMS(mobileNumber, smsText) } 
    
};

export const setLocation = async (deviceUid: string, districtId: number, userId: number) => {

    const userDetails = await userDetailRepository.find({where: {id: userId}});

    if (userDetails.length != 1) { throwBadRequest("user_detail_not_found") }

    var userDetail = userDetails[0]
    userDetail.districtId = districtId;
    await userDetailRepository.save(userDetail)

    var newSession = await refreshSessionService(userId, deviceUid);

    return newSession
}

export const setDelagate = async (deviceUid: string, userId: number) => {

    const userDetails = await userDetailRepository.find({where: {id: userId}});
    if (userDetails.length != 1) { throwBadRequest("user_detail_not_found") }

    var userDetail = userDetails[0]
    userDetail.isDelegate = !userDetail.isDelegate;
    await userDetailRepository.save(userDetail)

    var newSession = await refreshSessionService(userId, deviceUid);

    return newSession
}

export const changeMobile = async (deviceUid: string, userId: number, mobileNumber: string, apptovalCode: number) => {

    const exOtp = await checkOTP('changeMobile', deviceUid, "mobile", mobileNumber,  userId, apptovalCode)

    var exUsers = await userRepository.find({where: {isActive: true, id: userId}})
    if (exUsers.length != 1) { throwBadRequest("user_not_found") }

    var exUser = exUsers[0]
    exUser.mobileNumber = mobileNumber
    exUser.mobileNumberVerificationOtpId = exOtp.id
    exUser.updatedBy = userId
    exUser.updatedOn = dateNow()
    
    await userRepository.save(exUser)   
    return exUser

}