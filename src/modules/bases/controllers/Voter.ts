import { NextFunction, Request, Response } from 'express'
import { voterRepository } from '../repositories';


class VoterController {

    
    static getVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voters = await voterRepository.find({relations:{pollingStation: {district:{ region: true}}}});
            return res.json(Voters);
        } catch (error) {
            next(error)
        }

    };

    static getVoterById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Voters = await voterRepository.findOne({where: {id: id }, relations:{pollingStation: {district:{ region: true}}}});
            return res.json(Voters);
        } catch (error) {
            next(error)
        }

    };

    static addVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voter = req.body;
            await voterRepository.save(Voter);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static setActiveVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static deleteVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default VoterController;