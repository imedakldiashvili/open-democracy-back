import { NextFunction, Request, Response } from 'express'
import { votingCardRepository } from '../repositories';


class VotingCardController {


    static findDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = req.body;
            var votingCard = await votingCardRepository.findOne({
                                                                    where: {id: id},
                                                                    relations: {district: true, election: true, voter: true}
                                                                });
            return res.json(votingCard);
            
        } catch (error) {
            next(error)
        }
    };

    static findUserActiveVotingCards = async (req: Request, res: Response, next: NextFunction) => {
        
        const userSession = req.body.userSession;
        const voterId = userSession.user.id;
        try {
            var votingCards = await votingCardRepository.find({
                                                                    where: {voterId: voterId, statusId: 1},
                                                                    relations: {district: true, election: true, voter: true},
                                                                    order: {id: -1}
                                                                });
            return res.json(votingCards);
            
        } catch (error) {
            next(error)
        }
    };

    static findUserAllVotingCards = async (req: Request, res: Response, next: NextFunction) => {
        
        const userSession = req.body.userSession;
        const voterId = userSession.user.id;
        try {
            var votingCards = await votingCardRepository.find({
                                                                    where: {voterId: voterId},
                                                                    relations: {district: true, election: true, voter: true},
                                                                    order: {id: -1}
                                                                });
            return res.json(votingCards);
            
        } catch (error) {
            next(error)
        }
    };

}

export default VotingCardController;