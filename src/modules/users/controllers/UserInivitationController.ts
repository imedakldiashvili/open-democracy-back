import { NextFunction, Request, Response } from 'express'

import { AppError } from '../../../middlewares/error';

import { UserInivitation } from '../entities';

import { userInivitationRepository, userRepository } from '../repositories';
import { dateNow } from '../../../utils';





class UserInivitationController {
    
    static findBySender = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sernderUserId = req.body.senderUserId
            const users = await userInivitationRepository.findBy({senderUserId: sernderUserId});
            return res.json(users);
        } catch (error) {
            next(error)
        }

    };

    
    static add = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {senderUserId, personalId, mobile, fullName } = req.body; 
            console.log( req.body)
            const entity = new UserInivitation();            
            entity.senderUserId = senderUserId
            entity.personalId = personalId,
            entity.mobile = mobile
            entity.fullName = fullName            
            entity.expireOn =  dateNow();
            entity.statusId = 1

            await userInivitationRepository.save(entity);
            return res.json(entity);
        } catch (error) {
            next(error)
        }
    };

    static setActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default UserInivitationController;