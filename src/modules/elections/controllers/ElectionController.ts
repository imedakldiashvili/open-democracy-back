import { NextFunction, Request, Response } from 'express'
import { Election} from '../entities';
import { electionRepository } from '../repositories';


class ElectionControler {


    static findActiveElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({where:{statusId: 1}});
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

    static findElectionVotingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {electionId, voterId} = req.body;

            const election = electionRepository.findOne({where: {id: electionId}})
            const voter = electionRepository.findOne({where: {id: electionId}})

            return res.json("not implementedot");
        } catch (error) {
            next(error)
        }
    };

}

export default ElectionControler;