import { NextFunction, Request, Response } from 'express'

import { AppError, throwBadRequest } from '../../../middlewares/error';

import { UserDetail, UserInivitation } from '../entities';

import { userDetailRepository, userInivitationRepository, userRepository } from '../repositories';
import { dateNow } from '../../../utils';
import { serviceAddUserInivitaionAction } from '../../actions/services';
import { MoreThan } from 'typeorm';
import { verification } from '../services';



class UserVerificationController {


    static verification = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {districtId, personalId, email, firstName, lastName} = req.body;
            
            const createdBy = req.body.userSession.user.id

            console.log(districtId, personalId, email, firstName, lastName, createdBy)

            const result = await verification(personalId
                                            , email
                                            , firstName
                                            , lastName
                                            , districtId
                                            , createdBy)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

}

export default UserVerificationController ;