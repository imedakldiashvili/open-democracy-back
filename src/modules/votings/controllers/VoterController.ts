import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '../../../datasources';
import { ballotItemValueRepository, ballotRepository } from '../../ballots/repositories';
import { electionRepository } from '../../elections/repositories';
import { districtRepository } from '../../locations/repositories';
import { Vote, VoteBallotItem, VoteBallotItemValue, VotingCard, VotingCardBallot } from '../entities';
import { userDetailRepository } from '../../users/repositories';
import { voteRepository, votingCardRepository } from '../repositories';
import { serviceAddVotingAction } from '../../actions/services';


class VoterController {


    static findUserSessionVotingCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const voterId = parseInt(req.body.userSession.user.id);
            const election = await votingCardRepository.find({ 
                                        where: {voterId :voterId}, 
                                        relations: {election: true, district: true, voter: true },
                                        order: {id: -1}
                                    });
            return res.json(election);
        } catch (error) {
            next(error)
        }

    };

    static findUserSessionNewVotingCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const voterId = parseInt(req.body.userSession.user.id);
            const election = await votingCardRepository.find({ 
                                       where: {voterId :voterId, statusId: 1}, 
                                       relations: {election: true, district: true, voter: true },
                                       order: {id: -1}
                                    });
            return res.json(election);
        } catch (error) {
            next(error)
        }

    };


    static findElectionVotingCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const electionId = req.body.electionId;
            const election = await votingCardRepository.find({ 
                                        where: {electionId:electionId}, 
                                        relations: {election: true, district: true, voter: true },
                                        order: {id: -1}
                                    });
            return res.json(election);
        } catch (error) {
            next(error)
        }

    };

    static voter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voters = await userDetailRepository.find();
            return res.json(Voters);
        } catch (error) {
            next(error)
        }

    };


    static findVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voters = await userDetailRepository.find();
            return res.json(Voters);
        } catch (error) {
            next(error)
        }

    };

    static findOneVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const election = await userDetailRepository.findOneBy({ id: id });
            return res.json(election);
        } catch (error) {
            next(error)
        }

    };

    static votingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { electionId, districtId, voterId, ballots } = req.body;


            const votingCard = new VotingCard();
            votingCard.election = await electionRepository.findOneByOrFail({ id: electionId })
            votingCard.district = await districtRepository.findOneByOrFail({ id: districtId })
            votingCard.voter = await userDetailRepository.findOneByOrFail({ id: voterId })
            votingCard.votingCardBallots = []

            for (const ballot of ballots) {
                const votingCardBallot = new VotingCardBallot();
                votingCardBallot.ballot = await ballotRepository.findOneByOrFail({ id: ballot.ballotId })
                votingCard.votingCardBallots.push(votingCardBallot)
            }
        } catch (error) {
            next(error)
        }
    };


    static vote = async (req: Request, res: Response, next: NextFunction) => {
        const { electionId, votingCode, votingCardId, votedBallots, userSession} = req.body;
        
        const voterId = userSession.user.id
        try {
             await appDataSource.manager.transaction(async (transactionalEntityManager) => {
                
                const newVote = new Vote()
                newVote.votingCardId = votingCardId; 
                await voteRepository.save(newVote);

                for (const votedBallot of votedBallots) {    
                    const voteBallotItem = new VoteBallotItem()
                    voteBallotItem.code = votingCode
                    voteBallotItem.ballotId = votedBallot.ballot.id
                    voteBallotItem.ballotItemId = votedBallot.ballotItem.id
                    await transactionalEntityManager.save(voteBallotItem)
                    
                    for (const value of votedBallot.ballotItem.ballotItemSelectedValues) {
                        const voteBallotItemValue = new VoteBallotItemValue()
                        voteBallotItemValue.voteBallotItemId = voteBallotItem.id
                        voteBallotItemValue.ballotItemId = votedBallot.ballotItem.id 
                        voteBallotItemValue.ballotItemValueId = value.id
                        voteBallotItemValue.votedValue = ((votedBallot.ballotItem.numberOfItemValue - value.votedValue) + 1)                    
                        await transactionalEntityManager.save(voteBallotItemValue)
                    }
                }
            
                var votingCard = await votingCardRepository.findOneBy({id: votingCardId}) 
                votingCard.statusId = 2
                votingCard.votedAt = new Date()
                await votingCardRepository.save(votingCard);

            })

            const sessionUid = userSession.id;
            

            var election = await electionRepository.findOneBy({id: electionId}) 
            var action = await serviceAddVotingAction({ sessionUid, votingCardId, electionName: election.name, voterId })

            return res.json({action});

        } catch (error) {
            next(error)
        }
    };

    static addVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voter = req.body;
            await userDetailRepository.save(Voter);
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