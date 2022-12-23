import { dateNow, dateNowAddMinutes, otpCode } from "../../../utils";
import { Otp } from "../entities";
import { otpRepository } from "../repositories";


export const newOTP = async (type: string, value: string, createdBy: number) => { 
    const  exOtpCodes = await otpRepository.find({where: {isActive: true, value: value, type: type}})

    for (const otpCode of exOtpCodes) {
        otpCode.isActive = false,
        otpCode.expirationDate = dateNow()
        await otpRepository.save(otpCode)
    }

    const otp = new Otp();            
    otp.value = value 
    otp.type = type
    otp.code = otpCode()
    otp.isActive = true,
    otp.createdBy = createdBy,
    otp.createdOn = dateNow();
    otp.expirationDate = dateNowAddMinutes(5)

    const result = await otpRepository.save(otp)
    return  result
} 