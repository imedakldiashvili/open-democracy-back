import { NextFunction, Request, Response } from 'express'

import { throwBadRequest } from '../../../middlewares/error';
import { generateHash } from '../../../middlewares/security';

import { dateNow, newGuid } from '../../../utils';

import { userDetailRepository, userInivitationRepository, userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { addOTP, loginUserService, checkOTP } from '../../users/services';

import { User, UserDetail, UserPassword } from '../../users/entities';
import { use } from 'passport';
import { Like } from 'typeorm';
import { userInfo } from 'os';

class AuthContoller {
    
    static signUpOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email} = req.body;  

            const newEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: newEmail}});
            if (users.length > 0) { throwBadRequest("email_already_exists") }

            const result = await addOTP(deviceUid, "email", email, 1)          

            return res.json( result );
        
        } catch (error) {
            next(error)
        }
    };

    static signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, personalId, email, password, emailOtpCode} = req.body;  
            
            const newEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: newEmail}});

            if (users.length > 0) { throwBadRequest("email_already_exists") }

            const  emailOtp = await checkOTP(deviceUid, "email", email,  1, emailOtpCode )
          
            const user = new User();

            user.userName = personalId,
            user.email = newEmail,
            user.emailVerificationOtpId = emailOtp.id,
            user.isActive = true,
            user.createdBy = 1,
            user.createdOn = new Date();

            
            const newUser = await userRepository.save(user)

            const userInivitaion = await userInivitationRepository.findOne({where: { personalId: personalId, email: Like(`%${email}%`)}})

            if (userInivitaion)
            {
                const usedDetail = new UserDetail();
                usedDetail.id = newUser.id
                usedDetail.code = userInivitaion.personalId;
                usedDetail.fullName = userInivitaion.fullName;
                usedDetail.isActive = true;
                usedDetail.isDelegate = false;

                await userDetailRepository.save(usedDetail)
            }

 
            // var idString = newUser.id.toString();
            // var idStringSum = 0;
            // for (let i = 0; i < idString.length; i++) {
            //     var number = +idString.substring(i, i+1);
            //     idStringSum = idStringSum + number;
            // }
            // newUser.userName = (newUser.id * 100 + idStringSum % 97).toString()
            // await userRepository.save(user)
            


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

            var result = await loginUserService(deviceUid, newEmail, password)

            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email, password}  = req.body
            var result = await loginUserService(deviceUid, email.toLowerCase(), password)
            return res.json(result);

        } catch (error) {
            next(error)
        }
    };



}

export default AuthContoller;


