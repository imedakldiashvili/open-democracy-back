import { NextFunction, Request, Response } from 'express'
import { ballotRepository } from '../../ballots/repositories';
import { voterRepository, votingCardBallotRepository, votingCardRepository } from '../../votings/repositories';
import { Election} from '../entities';
import { electionRepository, electionStatusRepository } from '../repositories';
import { ElectionStatus } from '../entities/ElectionStatus';
import { off } from 'process';
import { serviceCalculateElectionResult, serviceCloseElection, servicePublishElection, serviceStartElection, serviceUpdateElectionTimePeriod } from '../services';
import { MoreThan } from 'typeorm';



class ElectionControler {


    static findItemsElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const elections = await electionRepository.find({
                where: {statusId: MoreThan(1)},
                relations: {status: true, timePeriods: true}, 
                order: {id: 1}
            });
            return res.json(elections);
        } catch (error) {
            next(error)
        }

    };

    static findDetailsElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {electionId} = req.body;
            const Elections = await electionRepository.findOne({
                where: {id: electionId },
                relations: {status: true, timePeriods: true, ballots: {ballotType: true, districts: true}}
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };


    static findActiveElections = async (req: Request, res: Response, next: NextFunction) => {
        const {voterId} = req.body;
        try {

            const activeElections = await electionRepository.find({
                where: {status: {id: 1} , ballots: {districts: {voters: {id: voterId}}}},
                relations: {ballots: {districts: {voters: true}, ballotType: true, ballotItems: {ballotItemValues: true} }},
                order: {id: "DESC", ballots: {ballotType: {id: "ASC"}}}
            });

            const votingCards = await votingCardRepository.find({
                where: {voter: {id: voterId}},
                relations: {voter:true, election: true}
            })

            console.log(votingCards)

            const activeElectionCards = []

            for (let activeElection of activeElections) {
                if (votingCards == null)
                {
                    const electionVoterCard = activeElection.id  
                    activeElectionCards.push(electionVoterCard)
                }
                else
                {
                    var votingCard = votingCards.filter(e=> e.election.id == activeElection.id);
                    const electionVoterCard = { activeElection, votingCard }
                    activeElectionCards.push(electionVoterCard)
                }
            }

            // console.log(activeElectionCards)

            return res.json(activeElectionCards);
        } catch (error) {
            next(error)
        }

    };

    static findAllElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({relations: {status: true, timePeriods: true}});
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

            var electionStatus =  await electionStatusRepository.findOneBy({id: 1});

            let election: Election = req.body;
            election.status = electionStatus;
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

    static publishElection = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await servicePublishElection()
        return res.json(result);
    }

    static startElectionTimePeriod = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceStartElection()
        return res.json(result);
    }

    static updateElectionTimePeriod = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceUpdateElectionTimePeriod()
        return res.json(result);
    }

    static closeElection = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceCloseElection()
        return res.json(result);
    }
    
    static calculateElectionResult = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceCalculateElectionResult()
        return res.json(result);
    }

}

export default ElectionControler;