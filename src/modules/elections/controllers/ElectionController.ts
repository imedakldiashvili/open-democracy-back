import { NextFunction, Request, Response } from 'express'
import { ballotRepository } from '../../ballots/repositories';
import { voterRepository, votingCardRepository } from '../../votings/repositories';
import { Election} from '../entities';
import { electionRepository } from '../repositories';



class ElectionControler {


    static findActiveElections = async (req: Request, res: Response, next: NextFunction) => {
        const {voterId} = req.body;
        try {

            const activeElections = await electionRepository.find({
                where: {statusId: 1, ballots: {districts: {voters: {id: voterId}}}},
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