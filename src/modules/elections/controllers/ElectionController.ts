import { NextFunction, Request, Response } from 'express'
import { electionRepository } from '../repositories';


class ElectionControler {


    static getElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({ 
                relations: { electionBallots: { electionBallotItems: true } },
                order: { electionBallots: { election: {id: 'desc'}, electionBallotItems : {code: 'ASC'}}} 
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static getElectionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Elections = await electionRepository.findOneBy({ id: id });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static addElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Election = req.body;
            
            await electionRepository.save(Election);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static setActiveElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static deleteElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

}

export default ElectionControler;