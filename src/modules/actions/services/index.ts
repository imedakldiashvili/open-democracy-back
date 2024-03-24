import { newGuid } from "../../../utils";
import { ActionTypeEnum } from "../../enums";
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

export const serviceAddVotingAction = async ({ sessionUid, voterId, votingCardId, electionName }) => {    
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


export const serviceAddUserInivitaionAction = async ({ sessionUid, createdUserId, inivitaitaionId, personalId, email, mobile }) => {    
    try {
        const action = new Action ()

        action.id = newGuid()
        action.actionTypeId = ActionTypeEnum.inivitation
        
        action.assingneTo = createdUserId,
        action.sessionUid = sessionUid

        action.actionId = inivitaitaionId
        action.actionName = email
        
        action.hasAmount = false
        
        action.createdBy = createdUserId,
        action.createdOn = new Date()
        
        await actionRepository.save(action);
        return action;

    } catch (error) {
        return error
    }
};