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
import { getBOGTodaysActivities, getNewBOGToken, tbcAccountMovements } from '../api';
import { serviceBankAccounts, servicebankSettings, serviceBOGTransactionProcesing, serviceTBCTransactionProcesing } from '../services';


class BanksContoller {
   
    
    static findBankAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await serviceBankAccounts()
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static BOGNewToken = async (req: Request, res: Response, next: NextFunction) => {
        try {            
            const result = await getNewBOGToken()
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };    

    static BOGTodaysActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const bankSettings = await servicebankSettings();
            const bankSettingBogAccount = bankSettings.filter(e=> e.code == "BOG_ACCOUNT")[0]
            const account = bankSettingBogAccount.value
            const result = await getBOGTodaysActivities(account)
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static BOGTransactionProcesing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await serviceBOGTransactionProcesing()
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    static TBCAccountMovements = async (req: Request, res: Response, next: NextFunction) => {
        try {


            const result = await tbcAccountMovements()
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static TBCTransactionProcesing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await serviceTBCTransactionProcesing()
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    static TBCNewPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {            
            const result = await getNewBOGToken()
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };  


}

export default BanksContoller;


