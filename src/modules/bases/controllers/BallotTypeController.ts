import { NextFunction, Request, Response } from 'express'
import { ballotTypeRepository } from '../repositories';


class BallotTypeController {

    
    static getBallotType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const BallotTypes = await ballotTypeRepository.find();
            return res.json(BallotTypes);
        } catch (error) {
            next(error)
        }

    };

    static getBallotTypeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const BallotTypes = await ballotTypeRepository.findOneBy({id: id});
            return res.json(BallotTypes);
        } catch (error) {
            next(error)
        }

    };

    static addBallotType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ballotType = req.body;
            await ballotTypeRepository.save(ballotType);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editBallotType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static setActiveBallotType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static deleteBallotType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default BallotTypeController;