import { NextFunction, Request, Response } from 'express'
import { ElectionPollingStationVoter, ElectionVotingCard, ElectionVotingCardVote } from '../entities';
import { electionBallotItemRepository, electionPollingStationBallotRepository, electionBallotRepository, electionPollingStationVoterRepository, electionVotingCardRepository, electionVotingCardVoteRepository, electionPollingStationRepository } from '../repositories';


class ElectionVoterControler {

    static getElectionVoter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const electionVoters = await electionPollingStationVoterRepository.find({
                relations: { electionPollingStation: true },
            });
            return res.json(electionVoters);
        } catch (error) {
            next(error)
        }
    };

    static getElectionVoterByCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const electionId = parseInt(req.params.electionId)
            const code = req.params.code

            const electionPollingStationVoter  = await electionPollingStationVoterRepository.find({
                where: {code: code, electionPollingStation: {election: {id: electionId}}},
                relations: {electionPollingStation: {election: true, pollingStation: true,  electionPollingStationBallots: {electionBallot: {electionBallotItems: true}}}}
            })
            return res.json(electionPollingStationVoter);
        } catch (error) {
            next(error)
        }
    };

    static addElectionVotingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const voterId = parseInt(req.body.voterId)
            const electionPollingStationVoter = await electionPollingStationVoterRepository.findOne({
                where: { id: voterId },
                relations: { electionPollingStation: {  election: true, region: true, district: true, pollingStation: true } } 
            });

            let electionVotingCard = new ElectionVotingCard

            electionVotingCard.electionPollingStationVoter = new ElectionPollingStationVoter() 
            electionVotingCard.electionPollingStationVoter = electionPollingStationVoter
            electionVotingCard.electionPollingStation = electionPollingStationVoter.electionPollingStation
            electionVotingCard.createdAt = new Date()
            electionVotingCard.expiredAt = new Date()
            electionVotingCard.voted = 0
        
            electionVotingCard = await electionVotingCardRepository.save(electionVotingCard)

            const result = await electionVotingCardRepository.findOne({
                where: {id: electionVotingCard.id},
                relations: {electionPollingStation: {election: true, pollingStation: true,  electionPollingStationBallots: {electionBallot: {electionBallotItems: true}}}}
            })

            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    static addElectionVotingCardVote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const votingCardId = parseInt(req.body.votingCardId)
            const electionPollingStationId = parseInt(req.body.electionPollingStationId)
            
            const votes = req.body.votes

            let electionVotingCard = await electionVotingCardRepository.findOneBy({id: votingCardId}) 
            const electionPollingStation = await electionPollingStationRepository.findOneBy({id: electionPollingStationId})

            if (electionVotingCard.voted != 0) {
                const text = electionVotingCard.voted == 1 ? "voting already started" :  electionVotingCard.voted == 2 ? "already voted" : "unckow error"
                return res.json(text);
            }

            electionVotingCard.voted = 1
            electionVotingCard.votedAt = new Date()
            await electionVotingCardRepository.save(electionVotingCard)

            for (var vote of votes)
            {
                const electionBallot = await electionBallotRepository.findOneBy({id: vote.electionBallotId}) 
                const electionBallotItem = await electionBallotItemRepository.findOneBy({id: vote.electionBallotItemId}) 
                
                const electionVotingCardVote = new ElectionVotingCardVote()
                electionVotingCardVote.electionVotingCard = electionVotingCard
                electionVotingCardVote.electionPollingStation = electionPollingStation
                electionVotingCardVote.electionBallot = electionBallot
                electionVotingCardVote.electionBallotItem = electionBallotItem
                electionVotingCardVote.isFavorite = vote.isFavorite
                electionVotingCardVote.votingPoint = vote.votingPoint 

                await electionVotingCardVoteRepository.save(electionVotingCardVote)               
            }

            electionVotingCard.voted = 2
            electionVotingCard.votedAt = new Date()
            await electionVotingCardRepository.save(electionVotingCard)

            const result = await electionVotingCardVoteRepository.findOne({
                where: {electionVotingCard: {id: votingCardId} },
                relations: {electionVotingCard: true, electionPollingStation: true, electionBallot: true, electionBallotItem: true }
            })

            return res.json(result);
        } catch (error) {
            next(error)
        }
    };


}

export default ElectionVoterControler;