import { newGuid } from "../../../utils";
import { BankTransactionRepository } from "../../donations/repositories";
import { ActionTypeEnum } from "../../enums";
import { userInivitationRepository } from "../../users/repositories";
import { votingCardBallotRepository } from "../../votings/repositories";
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

export const serviceGetActionDetail = async ({ actionId, userId }) => {    
    
    const  action = await actionRepository.findOne({where:{createdBy: userId, id: actionId}});
    
    if (action.actionTypeId = ActionTypeEnum.inivitation)
    {
        await userInivitationRepository.findOne({where: {id: action.actionId}});
        return action;
    }
    
    if (action.actionTypeId = ActionTypeEnum.voting)
    {
        await votingCardBallotRepository.findOne({where: {id: action.actionId}});
        return action;
    }

    if (action.actionTypeId = ActionTypeEnum.donation)
    {
        await BankTransactionRepository.findOne({where: {transactionClientCode: userId}});
        return action;
    }

    return action;
    
};