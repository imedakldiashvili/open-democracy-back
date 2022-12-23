import appSettings from '../settings'
export const otpCode = () => { 
  
  const random = appSettings.OTP_CODE == "random" ? Math.floor(Math.random() * 9000 + 1000) : 1111;
  return random
} 
