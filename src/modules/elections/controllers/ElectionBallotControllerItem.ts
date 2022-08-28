import { NextFunction, Request, Response } from 'express'
import { electionBallotItemRepository } from '../repositories';


class ElectionBallotItemControler {

    
    static getElectionBallotItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ElectionBallotItems = await electionBallotItemRepository.find();
            return res.json(ElectionBallotItems);
        } catch (error) {
            next(error)
        }

    };

    static getElectionBallotItemByElectionBallotId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const electionBallotId = parseInt(req.params.electionBallotId)
            const ElectionBallotItems = await electionBallotItemRepository.find({where: {electionBallotId: electionBallotId}});
            return res.json(ElectionBallotItems);
        } catch (error) {
            next(error)
        }

    };


    static getElectionBallotItemById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const ElectionBallotItems = await electionBallotItemRepository.findOneBy({id: id});
            return res.json(ElectionBallotItems);
        } catch (error) {
            next(error)
        }

    };

    static addElectionBallotItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ElectionBallotItem = req.body;
            await electionBallotItemRepository.save(ElectionBallotItem);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editElectionBallotItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static setActiveElectionBallotItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static deleteElectionBallotItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

}

export default ElectionBallotItemControler;