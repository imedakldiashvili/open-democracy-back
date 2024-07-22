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


}

export default VotingCardController;