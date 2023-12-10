import { NextFunction, Request, Response } from 'express'
import { BankTransactionRepository } from '../repositories';




class DonationController {

    static donationsPublicList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const donations = await BankTransactionRepository.find({order: {id: -1}});
            return res.json(donations);
        } catch (error) {
            next(error)
        }
    };
}

export default DonationController;