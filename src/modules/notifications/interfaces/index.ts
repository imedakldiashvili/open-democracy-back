export interface MailMsg {
    from: string;
    to: string;
    subject: string;
    html: string;
  }
  
export interface SmsMsg {
    from: string;
    to: string;
    smsText: string;
}


