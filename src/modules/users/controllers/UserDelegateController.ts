import { NextFunction, Request, Response } from 'express'

import { setDelagate, } from '../services';



class UserDelegateController {

    static setDelagate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid

            const result = await setDelagate(deviceUid, userId)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

}

export default UserDelegateController ;