import { NextFunction, Request, Response } from 'express'
import { ballotTypeRepository } from '../repositories';


class BallotTypeControler {

    
    static getBallotTypeControler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("getBallotTypeControler")
            const BallotTypes = await ballotTypeRepository.find();
            return res.json(BallotTypes);
        } catch (error) {
            next(error)
        }

    };
    static addBallotTypeControler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ballotType = req.body;
            await ballotTypeRepository.save(ballotType);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editBallotTypeControler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

}

export default BallotTypeControler;