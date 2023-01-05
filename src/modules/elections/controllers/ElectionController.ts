import { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm';
import { ballotRepository,pollingStationRepository, voterRepository } from '../../bases/repositories';
import { Election} from '../entities';
import { electionRepository } from '../repositories';


class ElectionControler {


    static getActiveElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({where:{statusId: 1}});
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static getElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find();
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

            let election: Election = req.body;
            election.statusId = 1;
            election = await electionRepository.save(election);

            const ballotIds = req.body.ballotIds;

            const ballots = await ballotRepository.find({ 
                relations: { ballotType: true, ballotItem: true }
            });

            const voters = await voterRepository.find({where: { isActive: true }});


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