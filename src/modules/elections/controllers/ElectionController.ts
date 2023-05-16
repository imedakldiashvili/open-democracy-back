import { NextFunction, Request, Response } from 'express'
import { ballotRepository } from '../../ballots/repositories';
import { voterRepository } from '../../votings/repositories';
import { Election} from '../entities';
import { electionRepository } from '../repositories';


class ElectionControler {


    static findActiveElections = async (req: Request, res: Response, next: NextFunction) => {
        const {voterId} = req.body;
        try {
            const Elections = await electionRepository.find({
                relations: {ballots: {districts: {voters: true}, ballotType: true, ballotItems: {ballotItemValues: true} }},
                where: {statusId: 1, ballots: {districts: {voters: {id: voterId}}}},
                order: {id: "DESC", ballots: {ballotType: {id: "ASC"}}}
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findAllElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find();
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findOneElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const election = await electionRepository.findOneBy({ id: id });
            return res.json(election);
        } catch (error) {
            next(error)
        }

    };

    static addElection = async (req: Request, res: Response, next: NextFunction) => {
        try {

            let election: Election = req.body;
            election.statusId = 1;
            election = await electionRepository.save(election);

            election.statusId = 2;
            election = await electionRepository.save(election);

            return res.json("success");

        } catch (error) {
            next(error);
        }
    }

    static setActiveElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("not implemented");
        } catch (error) {
            next(error)
        }
    };

    static deleteElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("nnot implementedot");
        } catch (error) {
            next(error)
        }
    };



}

export default ElectionControler;