import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '../../../datasources';
import { dateNow, newGuid } from '../../../utils';
import { Action } from '../../actions/entities';
import { actionTypeRepository } from '../../actions/repositories';
import { ballotItemRepository, ballotItemValueRepository, ballotRepository } from '../../ballots/repositories';
import { electionRepository } from '../../elections/repositories';
import { districtRepository } from '../../locations/repositories';
import { VoteBallotItem, VoteBallotItemValue, VotingCard, VotingCardBallot } from '../entities';
import { userDetailRepository } from '../../users/repositories';
import { votingCardRepository } from '../repositories';
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


    static getNewVotingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { electionId, voterId } = req.body;
            
            const election = await electionRepository.findOneOrFail({
                where: { id: electionId, actualStatusSchedule: { status: {id:1 }}, }
            });

            const ballots = await ballotRepository.find({
                relations: {ballotType: true, ballotItems: {ballotItemValues: true} },
                where: { election: { id: electionId }, districts: { userDetails: { id: voterId } } },
                order: { index: "ASC", ballotItems: { code: "ASC" } }
            });

            const voter = await userDetailRepository.findOneOrFail({
                relations: { district: true },
                where: { id: voterId }
            })

            const votingCard = { voter, election, ballots }

            return res.json(votingCard);
        } catch (error) {
            next(error)
        }
    };


    static newVotingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { electionId, voterId } = req.body;

            const election = await electionRepository.findOneOrFail({
                where: { id: electionId, actualStatusSchedule:{status: {id: 1 }} }
            });

            const ballots = await ballotRepository.find({
                relations: {ballotType: true, ballotItems: {ballotItemValues: true} },
                where: { election: { id: electionId }, districts: { userDetails: { id: voterId } } },
                order: { index: "ASC", ballotItems: { code: "ASC" } }
            });

            const voter = await userDetailRepository.findOneOrFail({
                relations: { district: true },
                where: { id: voterId }
            })

            const votingCard = { voter, election, ballots }

            return res.json(votingCard);
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
        try {
            const { votingCardId, electionId, voterId, sessionUid, votedBallots} = req.body;

            const votingCard = await votingCardRepository.findOneOrFail({ 
                                                            where: { id: votingCardId, electionId: electionId, voterId: voterId, statusId: 1}, 
                                                            relations: {voter: true, election: true}
                                                        })
            await appDataSource.manager.transaction(async (transactionalEntityManager) => {
                for (const votedBallot of votedBallots) {    
                    const voteBallotItem = new VoteBallotItem()
                    voteBallotItem.code = votingCard.voter.code
                    voteBallotItem.ballotId = votedBallot.ballot.id
                    voteBallotItem.ballotItemId = votedBallot.ballotItem.id

                    await transactionalEntityManager.save(voteBallotItem)

                    for (const value of votedBallot.ballotItem.ballotItemSelectedValues) {
                        const voteBallotItemValue = new VoteBallotItemValue()
                        voteBallotItemValue.voteBallotItem = voteBallotItem
                        voteBallotItemValue.ballotItemValueNumber = value.index
                        voteBallotItemValue.ballotItemValue = await ballotItemValueRepository.findOneByOrFail({ id: value.id })
                        await transactionalEntityManager.save(voteBallotItemValue)
                    }
                }
                let dateTime = new Date()
                votingCard.votedAt = dateTime
                votingCard.statusId = 2    
                await transactionalEntityManager.save(votingCard)

            })

            var electionName = votingCard.election.name
            
            await serviceAddVotingAction({voterId, sessionUid, votingCardId, electionName })

            return res.json({votingCard});

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