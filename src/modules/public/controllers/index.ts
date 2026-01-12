
import { NextFunction, Request, Response } from 'express'
import { electionRepository } from '../../elections/repositories';
import { BankTransactionRepository } from '../../donations/repositories';
import { userDetailRepository, userPersonalIdRepository } from '../../users/repositories';
import { votedBallotItemValueRepository, votingCardRepository } from '../../votings/repositories';
import { delegateGroupRepository, delegateRepository } from '../../delegates/repositories';
import { getTake, getSkip } from '../../../utils/pagination';
import { serviceBankAccounts } from '../../banks/services';
import { serviceCreateElection } from '../../elections/services';
import { appDownloadUrlRepository } from '../../app-downloads/repositoreis';
import { addOTP, addUserInivitation, checkOTP } from '../../users/services';
import { sendSMS } from '../../notifications/smsApi';

class PublicControler {


    static newInvitation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newInvitation  = req.body;
            const target = 'newInvitation'
            const mobileNumber =  newInvitation.mobileNumber
            const result = await addOTP(target, "deviceUid", "mobile", mobileNumber, 1)   
            const smsText = `code: ${result.code} for ${target}`

            const sms = await sendSMS(mobileNumber, smsText) 
            return res.json({id: result.id, status: result.status, type: result.type, value: result.value});
        
        } catch (error) {
            next(error)
        }
    };

     static confirmInvitation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newInvitation  = req.body;
            const target = 'newInvitation'
            const mobileNumber =  newInvitation.mobileNumber
            const code = newInvitation.code

            const result = await checkOTP(target, "deviceUid", "mobile", mobileNumber, 1, code)
            var newInivitation = await addUserInivitation(mobileNumber, "full name", "email", 1, "sessionUd")

            const smsText = `link: https://www.opendemocracy.ge/inivitations/${newInivitation.id}`    
            const sms = await sendSMS(mobileNumber, smsText) 
            
            return res.json({id: newInivitation.id, status: result.status, type: result.type, value: result.value});
        
        } catch (error) {
            next(error)
        }
    };


    static findBankAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await serviceBankAccounts()
            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static findElectionsDetail = async (req: Request, res: Response, next: NextFunction) => {

        var electionId = parseInt(req.body.electionId)
        try {
            const Elections = await electionRepository.findOne({
                where: { id: electionId, statusSchedule: { status: { stage: { isActual: true } } } },
                relations: { actualStatusSchedule: { status: { stage: true } }, statusSchedule: { status: true }, ballots: { district: true, ballotItems: { ballotItemValues: {ballotItemValueVote: true}, ballotItemSubjects: true } } },
                order: { statusSchedule: { status: { id: -1 } }, 
                          ballots: { district: {region: +1}, districtId:+1, index: +1, 
                                     ballotItems: { valuePercent: 'DESC', index: +1, ballotItemSubjects: { index: +1 }, 
                                     ballotItemValues: {votedValue: 'DESC', votedPosition: 'ASC', index: 'DESC', 
                                                        ballotItemValueVote: {votedValue: 'DESC'}} } } }
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findElections = async (req: Request, res: Response, next: NextFunction) => {
        const pagination = req.query
        const skip = getSkip(pagination)
        const take = getTake(pagination)
        try {
            const pageList = await electionRepository.find({
                relations: { actualStatusSchedule: { status: true } },
                order: { id: -1 },
                skip: skip,
                take: take,
                select: { id: true, name: true, valueDateFrom: true, valueDateTo: true, registeredVoters: true, participantVoters: true, actualStatusSchedule: { id: true, status: { id: true, name: true } } },

            });
            const count = await electionRepository.count()
            return res.json({ pageList, count });
        } catch (error) {
            next(error)
        }

    };

    
    static findVotedBallotItemList = async (req: Request, res: Response, next: NextFunction) => {
        
        var ballotItemId = parseInt(req.body.ballotItemId)


        try {
            const result = await votedBallotItemValueRepository
                                .createQueryBuilder("value")
                                .innerJoin("value.ballotItemValue", "ballotItemValue")
                                .innerJoin("value.ballotItem", "ballotItem")
                                .select("value.ballot_item_value_id", "ballotItemValueId")
                                .addSelect("value.ballot_item_value_number", "ballotItemValueNumber")
                                .addSelect("ballotItemValue.voted_value", "ballotitemVotedValue")
                                .addSelect("COUNT(value.id)", "count")
                                .where("value.ballotItemId = :ballotItemId", {ballotItemId: ballotItemId})
                                .groupBy("value.ballot_item_value_number")
                                .addGroupBy("value.ballot_item_value_id")
                                .addGroupBy("ballotItemValue.voted_value")
                                .orderBy("ballotItemValue.voted_value")
                                .addOrderBy("value.ballot_item_value_id")
                                .getRawMany();

            return res.json(result);
        } catch (error) {
            next(error)
        }

    };

    static findElectionsVingCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pagination = req.query
            const skip = getSkip(pagination)
            const take = getTake(pagination)

            var electionId = parseInt(req.body.electionId)
            const pageList = await votingCardRepository.find({
                where: { electionId: electionId },
                relations: { district: { region: true }, voter: true },
                order: { statusId: -1 },
                skip: skip,
                take: take,
                select: { id: true, district: { name: true, region: { name: true } }, votedAt: true, statusId: true },

            });
            const count = await votingCardRepository.count({ where: { electionId: electionId } })
            return res.json({ pageList, count });
        } catch (error) {
            next(error)
        }

    };

    static findDonations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pagination = req.query
            const skip = getSkip(pagination)
            const take = getTake(pagination)

            const pageList = await BankTransactionRepository.find({
                order: { transactionDate: -1, id: -1 },
                skip: skip,
                take: take,
                select: { channelCode: true, transactionAccountMask: true, transactionAmount: true, transactionDate: true }
            });
            const count = await BankTransactionRepository.count()
            return res.json({ pageList, count });
        } catch (error) {
            next(error)
        }

    };

    static finSupporters = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pagination = req.query
            const skip = getSkip(pagination)
            const take = getTake(pagination)

            const pageList = await userDetailRepository.find({
                relations: { district: { region: true } },
                order: { id: -1 },
                skip: skip,
                take: take,
                select: { district: { id: true, name: true, region: { id: true, name: true } }, id: true, fullName: true, firstName: true, lastName: true }
            });
            const count = await userDetailRepository.count()
            return res.json({ pageList, count });
        } catch (error) {
            next(error)
        }

    };

    static findDelegates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pagination = req.query
            const skip = getSkip(pagination)
            const take = getTake(pagination)

            const pageList = await delegateRepository.find({
                where: { isActive: true },
                relations: { 
                            user: {userDetail: {district: { region: true } }},
                            delegateGroup: {delegateGroupType: true} },
                order: { id: -1 },
                skip: skip,
                take: take,

                select: { id: true, imageUrl: true, delegateName: true, 
                    user: {id: true, userDetail: {id: true, fullName: true, firstName: true, lastName: true,  
                                     district: { id: true, name: true, 
                                                 region: { id: true, name: true } } }},
                    delegateGroup: {code: true, color: true, name: true, imageUrl: true, number: true, delegateGroupType: {id: true, code: true, name: true} }
                }
            });
            const count = await userDetailRepository.count({ where: { isDelegate: true } })

            return res.json({ pageList, count });
        } catch (error) {
            next(error)
        }

    };

    static findDelegatesGroups = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await delegateGroupRepository.find({
                where: { isActive: true }, order: { number: +1 },
                relations: { delegates: { user: { userDetail: true } }, delegateGroupType: true },
            });
            return res.json(data);
        } catch (error) {
            next(error)
        }

    };


    static createElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var resut = await serviceCreateElection(1000)
            return res.json(resut.message);
        } catch (error) {
            next(error)
        }

    };

    
    static findAppDownloadUrls = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const BallotTypes = await appDownloadUrlRepository.find();
            return res.json(BallotTypes);
        } catch (error) {
            next(error)
        }
    };

    static findNumberDonationPerson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userPersonalIdRepository
                .createQueryBuilder("p")
                .select("COUNT(DISTINCT p.personal_id)", "count")
                .getRawOne();
            
                const count = Number(result.count);

            return res.json({numbetOfDonationPerson: count });
        } catch (error) {
            next(error)
        }
    };

}

export default PublicControler