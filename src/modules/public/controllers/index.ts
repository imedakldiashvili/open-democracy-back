
import { NextFunction, Request, Response } from 'express'
import { electionRepository } from '../../elections/repositories';
import { BankTransactionRepository } from '../../donations/repositories';
import { MoreThan, Not } from 'typeorm';
import { userDetailRepository } from '../../users/repositories';
import { ElectionStatusEnum } from '../../enums';

class PublicControler {


    static findElectionsActual = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.findOne({
                where: { actualStatusSchedule: { status: {isActual: true}}, statusSchedule: {status: {stage: {isActual: true}}} },
                relations: { actualStatusSchedule: { status: {stage: true}}, statusSchedule: {status: true}, ballots: {ballotItems: {ballotItemValues: true}} },
                order: { id:-1, statusSchedule: {status: {id:-1}}, ballots: {index: +1, ballotItems: {index: +1}}}
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await electionRepository.find({
                relations: { actualStatusSchedule: {status: true} , }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static findDonations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await BankTransactionRepository.find({
                select: { transactionAmount: true, transactionClientName: true, transactionDate: true }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static finVoters = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await userDetailRepository.find({
                select: { district: { name: true }, id: true, firstName: true, lastName: true }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

}

export default PublicControler