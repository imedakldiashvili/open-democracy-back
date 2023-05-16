import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '../../../datasources';
import { dateNow, newGuid } from '../../../utils';
import { Action } from '../../actions/entities';
import { actionTypeRepository } from '../../actions/repositories';
import { ballotItemRepository, ballotItemValueRepository, ballotRepository } from '../../ballots/repositories';
import { electionRepository } from '../../elections/repositories';
import { districtRepository } from '../../locations/repositories';
import { VotingBallotItem, VotingBallotItemValue, VotingCard, VotingCardBallot } from '../entities';
import { voterRepository, votingCardBallotRepository, votingCardRepository } from '../repositories';


class VoterController {

    static voter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voters = await voterRepository.find();
            return res.json(Voters);
        } catch (error) {
            next(error)
        }

    };

    static newVotingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { electionId, voterId } = req.body;

            const election = await electionRepository.findOneOrFail({
                where: { id: electionId, statusId: 1, }
            });

            const ballots = await ballotRepository.find({
                relations: {ballotType: true, ballotItems: {ballotItemValues: true} },
                where: { election: { id: electionId }, districts: { voters: { id: voterId } } },
                order: { index: "ASC", ballotItems: { code: "ASC" } }
            });

            const voter = await voterRepository.findOneOrFail({
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
            const Voters = await voterRepository.find();
            return res.json(Voters);
        } catch (error) {
            next(error)
        }

    };

    static findOneVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const election = await voterRepository.findOneBy({ id: id });
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
            votingCard.voter = await voterRepository.findOneByOrFail({ id: voterId })
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
            const { electionId, districtId, voterId, createdBy, sessionUid, ballots, votedBallots} = req.body;

            const votingCard = new VotingCard();
            votingCard.election = await electionRepository.findOneByOrFail({ id: electionId })
            votingCard.district = await districtRepository.findOneByOrFail({ id: districtId })
            votingCard.voter = await voterRepository.findOneByOrFail({ id: voterId })
            votingCard.createdAt = dateNow()
            votingCard.votingCardBallots = []

            await appDataSource.manager.transaction(async (transactionalEntityManager) => {

                await transactionalEntityManager.save(votingCard)

                const action = new Action();
                action.id = newGuid()
                action.sessionUid = sessionUid
                action.actionType = await actionTypeRepository.findOneByOrFail({ id: 3 })
                action.actionId = votingCard.id
                action.actionName = votingCard.election.name;
                action.createdBy = createdBy
                action.createdOn = dateNow()
                action.hasAmount = false

                await transactionalEntityManager.save(action)

                for (const ballot of ballots) {
                    const votingCardBallot = new VotingCardBallot();
                    votingCardBallot.votingCard = votingCard
                    votingCardBallot.ballot = await ballotRepository.findOneByOrFail({ id: ballot.ballotId })
                    await transactionalEntityManager.save(votingCardBallot)
                }

                for (const votedBallot of votedBallots) {
                    const votingBallotItem = new VotingBallotItem()
                    votingBallotItem.voterCode = votingCard.voter.voterCode
                    votingBallotItem.ballot = await ballotRepository.findOneByOrFail({ id: votedBallot.ballotId })
                    votingBallotItem.ballotItem = await ballotItemRepository.findOneByOrFail({ id: votedBallot.ballotItem.id })

                    await transactionalEntityManager.save(votingBallotItem)
                    for (const value of votedBallot.ballotItem.ballotItemSelectedValues) {
                        const votingBallotItemValue = new VotingBallotItemValue()
                        votingBallotItemValue.votingBallotItem = votingBallotItem
                        votingBallotItemValue.ballotItemValueNumber = value.index
                        votingBallotItemValue.ballotItemValue = await ballotItemValueRepository.findOneByOrFail({ id: value.id })
                        await transactionalEntityManager.save(votingBallotItemValue)
                    }
                }

            })

            return res.json(votingCard.id);

        } catch (error) {
            next(error)
        }
    };

    static addVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Voter = req.body;
            await voterRepository.save(Voter);
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