import { NextFunction, Request, Response } from 'express'

import { throwBadRequest } from '../../../middlewares/error';
import { generateHash } from '../../../middlewares/security';

import { dateNow, newGuid } from '../../../utils';

import { userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { addOTP, loginUserService, checkOTP } from '../../users/services';

import { User, UserPassword } from '../../users/entities';

class AuthContoller {
    
    static signUpOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, userName, mobileNumber } = req.body;  

            const newUserName = userName.toLowerCase();
            const users = await userRepository.find({where: {userName: newUserName}});
            if (users.length > 0) { throwBadRequest("user_name_already_exists") }

            const result = await addOTP(deviceUid, "mobile", mobileNumber, 1)          

            return res.json( result );
        
        } catch (error) {
            next(error)
        }
    };

    static signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, userName, password, mobileNumber,  mobileOtpCode} = req.body;  
            
            const newUserName = userName.toLowerCase();
            const users = await userRepository.find({where: {userName: newUserName}});

            if (users.length > 0) { throwBadRequest("user_name_already_exists") }

            const  mobileOtp = await checkOTP(deviceUid, "mobile", mobileNumber, 1, mobileOtpCode )
          
            const user = new User();

            user.userName = userName;
            user.mobileNumber = mobileNumber;
            user.mobileNumberVerificationOtpId = mobileOtp.id,
            user.isActive = true,
            user.createdBy = 1,
            user.createdOn = new Date();

            const newUser = await userRepository.save(user)

            const passwordSalt = newGuid();
            const passwordHash = generateHash(password,passwordSalt)
            const userPassword = new UserPassword()

            userPassword.userId = newUser.id
            userPassword.passwordSalt = passwordSalt
            userPassword.passwordHash = passwordHash
            userPassword.isActive = true
            userPassword.isTemporary = false
            userPassword.createdBy = 1
            userPassword.createdOn = new Date()

            const resUserPassword = await userPasswordRepository.save(userPassword)

            var result = await loginUserService(deviceUid, userName, password)

            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, userName, password}  = req.body
            var result = await loginUserService(deviceUid, userName.toLowerCase(), password)
            return res.json(result);

        } catch (error) {
            next(error)
        }
    };



}

export default AuthContoller;


