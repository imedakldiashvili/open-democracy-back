import { md5 } from "./md5";
export const generateHash = (secretText: string, salt: string) => 
{
    return md5(secretText + salt)
}