import { NextFunction, Request, Response } from 'express'

import { throwBadRequest } from '../../../middlewares/error';
import { generateHash } from '../../../middlewares/security';

import { dateNow, newGuid } from '../../../utils';

import { userDetailRepository, userInivitationRepository, userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { addOTP, loginUserService, checkOTP } from '../../users/services';

import { User, UserDetail, UserPassword } from '../../users/entities';
import { Like, MoreThanOrEqual } from 'typeorm';
import { sendMail } from '../../notifications/services';

import settings from '../../../settings';
import { getBOGTodaysActivities, getNewBOGToken } from '../api';
import { serviceBankAccounts, serviceBOGTransactionProcesing } from '../services';


class BanksContoller {
    
    static NewBOGToken = async (req: Request, res: Response, next: NextFunction) => {
        try {            
            const result = await getNewBOGToken()
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    

    static BOGTodaysActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const account = req.params.account
            const result = await getBOGTodaysActivities(account)
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };


    static BOGTransactionProcesing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const account = req.params.account
            const result = await serviceBOGTransactionProcesing()
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static BankAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await serviceBankAccounts()
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };


}

export default BanksContoller;


