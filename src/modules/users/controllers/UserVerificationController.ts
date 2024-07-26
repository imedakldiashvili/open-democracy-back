import { NextFunction, Request, Response } from 'express'

import { setLocation, verification } from '../services';



class UserVerificationController {


    static verification = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {personalId, firstName, lastName } = req.body;
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid

            const result = await verification(deviceUid
                                            , personalId
                                            , firstName
                                            , lastName
                                            , userId)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    static setLocation = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {locationId} = req.body;
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid

            const result = await setLocation(deviceUid, locationId, userId)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

}

export default UserVerificationController ;