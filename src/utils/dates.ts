
export const dateNow = () => {
    return new Date()
}

export const dateNowMinute = () => {
    const date = new Date()
    return new Date(date.getTime() - date.getMilliseconds());
}

export const dateNowMilliseconds = () => {
    const date = new Date()
    return new Date(date.getTime());
}

export const dateNowAddMinutes = (minutes: number) => {
    const date = addMinutes(new Date(), minutes)
    return date
}

export const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
}

export const newDateW = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
}