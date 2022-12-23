import { md5 } from "./md5";
export const generatePasswordHash = (password: string, salt: string) => 
{
    return md5(password+salt)
}