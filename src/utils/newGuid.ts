import { v4 as uuid } from 'uuid';

export const newGuid = () => { 
    const guid =  uuid()
    return  guid
} 
