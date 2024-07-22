import { newGuid } from "../../../utils";
import { BankTransactionRepository } from "../../donations/repositories";
import { ActionTypeEnum } from "../../enums";
import { userInivitationRepository } from "../../users/repositories";
import { votingCardBallotRepository, votingCardRepository } from "../../votings/repositories";
import { Action } from "../entities";
import { actionRepository, actionTypeRepository } from "../repositories";

export const serviceAddDonationAction = async ({ sessionUid, userId, amount, currencyId }) => {    
    try {
        const action = new Action ()

        action.id = newGuid()
        action.actionTypeId = ActionTypeEnum.donation
        action.assingneTo = userId,
        action.sessionUid = sessionUid

        action.currencyId = currencyId
        action.Amount = amount,
        
        await actionRepository.save(action);
        return action;

    } catch (error) {
        return error
    }
};

export const serviceAddVotingAction = async ({ sessionUid, votingCardId, electionName, voterId }) => {    
    try {
        const action = new Action ()
        
        action.id = newGuid()
        action.actionTypeId = ActionTypeEnum.voting
        
        action.assingneTo = voterId,
        action.sessionUid = sessionUid

        action.actionId = votingCardId
        action.actionName = electionName
        
        action.hasAmount = false
        
        action.createdBy = voterId,
        action.createdOn = new Date()


        await actionRepository.save(action);
        return action;
    } catch (error) {
        console.log(error) 
    }
};


export const serviceAddUserInivitaionAction = async ({ sessionUid, createdUserId, inivitaitaionId, personalId, fullName, uid }) => {    
    const action = new Action ()

        action.id = newGuid()
        action.actionTypeId = ActionTypeEnum.inivitation
        
        action.assingneTo = createdUserId,
        action.sessionUid = sessionUid

        action.actionId = inivitaitaionId
        action.actionName = personalId + ' ' + fullName
        
        action.hasAmount = false
        
        action.createdBy = createdUserId,
        action.createdOn = new Date()
        
        await actionRepository.save(action);
        return action;
};

export const serviceGetActionDetail = async ({ id, actionId, userId }) => {    
    
    const  action = await actionRepository.findOne({where:{id: id, actionId: actionId, createdBy: userId}});
    
    console.log(action)


    if (action.actionTypeId == ActionTypeEnum.inivitation)
    {
        console.log("inivitation")
        var inivitation = await userInivitationRepository.findOne({where: {id: action.actionId}});
        return inivitation;
    }
    
    if (action.actionTypeId == ActionTypeEnum.voting)
    {
        console.log("voting")
        var votingCard = await votingCardRepository.findOne({
                                                                where: {id: action.actionId}, 
                                                                relations: {district: true, election: true, voter: true}
                                                            });
        return votingCard;
    }

    if (action.actionTypeId == ActionTypeEnum.donation)
    {
        console.log("bankTransaction")
        var bankTransaction = await BankTransactionRepository.findOne({where: {transactionClientCode: userId}});
        return bankTransaction;
    }

    return action;
    
};