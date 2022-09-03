import { NextFunction, Request, Response } from 'express'
import { electionBallotRepository } from '../repositories';


class ElectionBallotControler {

    
    static getElectionBallot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ElectionBallots = await electionBallotRepository.find({relations: {ballotType: true}});
            return res.json(ElectionBallots);
        } catch (error) {
            next(error)
        }

    };

    static getElectionBallotByElectionId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const electionId = parseInt(req.params.electionId)
            const ElectionBallots = await electionBallotRepository.find({relations: {ballotType: true}});
            return res.json(ElectionBallots);
        } catch (error) {
            next(error)
        }

    };


    static getElectionBallotById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const ElectionBallots = await electionBallotRepository.findOneBy({id: id});
            return res.json(ElectionBallots);
        } catch (error) {
            next(error)
        }

    };

    static addElectionBallot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ElectionBallot = req.body;
            await electionBallotRepository.save(ElectionBallot);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editElectionBallot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static setActiveElectionBallot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static deleteElectionBallot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

}

export default ElectionBallotControler;