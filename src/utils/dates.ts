
export const dateNow = () => { 
    return  new Date()
} 

export const dateNowAddMinutes = (minutes: number) => { 
    let date = new Date()
    date.setMinutes(date.getMinutes() + minutes);
    return  date
} 
