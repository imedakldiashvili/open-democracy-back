
import { NextFunction, Request, Response } from 'express'
import { electionRepository } from '../../elections/repositories';
import { BankTransactionRepository } from '../../donations/repositories';
import { userDetailRepository } from '../../users/repositories';
import { votingCardRepository } from '../../votings/repositories';
import { delegateGroupRepository, delegateRepository } from '../../delegates/repositories';
import { Not } from 'typeorm';

class PublicControler {


    static findElectionsActual = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.findOne({
                where: { actualStatusSchedule: { status: { isActual: true } }, statusSchedule: { status: { stage: { isActual: true } } } },
                relations: { actualStatusSchedule: { status: { stage: true } }, statusSchedule: { status: true }, ballots: { ballotItems: { ballotItemValues: true } } },
                order: { id: -1, statusSchedule: { status: { id: -1 } }, ballots: { index: +1, ballotItems: { valuePercent: -1, index: +1, ballotItemValues: {votedValue: -1, index: +1} } } }
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findElectionsDetail = async (req: Request, res: Response, next: NextFunction) => {
        
        var electionId = parseInt(req.body.electionId)
        try {
            const Elections = await electionRepository.findOne({
                where: { id: electionId} ,
                relations: { actualStatusSchedule: { status: { stage: true } }, statusSchedule: { status: true }, ballots: { ballotItems: { ballotItemValues: true } } },
                order: { id: -1, statusSchedule: { status: { id: -1 } }, ballots: { index: +1, ballotItems: { valuePercent: -1, index: +1 } } }
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await electionRepository.find({
                relations: { actualStatusSchedule: { status: true } },
                order: { id: -1 },
                select: { id: true, name: true, valueDateFrom: true, valueDateTo: true, registeredVoters: true, participantVoters: true, actualStatusSchedule: { status: { id: true, name: true } } }

            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static findElectionsVingCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var electionId = parseInt(req.body.electionId)
            const data = await votingCardRepository.find({
                where: { electionId: electionId },
                relations: { district: { region: true }, voter: true },
                order: {statusId: -1},
                select: { id: true, district: { name: true, region: { name: true } }, votedAt: true, statusId: true }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static findDonations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await BankTransactionRepository.find({
                order: { id: -1 },
                select: { channelCode: true, transactionAccountMask: true, transactionClientName: true, transactionAmount: true, transactionDate: true }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static finSupporters = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await userDetailRepository.find({
                relations: { district: { region: true } },
                order: { id: -1 },
                select: { district: { id: true, name: true, region: { id: true, name: true } }, id: true, fullName: true, firstName: true, lastName: true }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static findDelegates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await userDetailRepository.find({
                where: {isDelegate: true},
                relations: { district: { region: true } },
                order: { id: -1 },
                select: { district: { id: true, name: true, region: { id: true, name: true } }, id: true, fullName: true, firstName: true, lastName: true }
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

    static findDelegatesGroups = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await delegateGroupRepository.find({
                where: { isActive: true }, order: { number: +1 },
                relations: { delegates: {user: { userDetail: true } } },
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };

}

export default PublicControler