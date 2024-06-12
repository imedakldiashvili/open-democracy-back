export const getSkip = (pagination) => {
    const pageIndex =  pagination ?  pagination.pageIndex ? parseInt(pagination.pageIndex.toString()) : 1 : 1
    const pageSize =  pagination ?  pagination.pageSize ? parseInt(pagination.pageSize.toString()) : 10 : 10

    const skip = (pageIndex - 1) * pageSize
    return skip
}

export const getTake = (pagination) => {
    const take = pagination ?  pagination.pageSize ? parseInt(pagination.pageSize.toString()) : 10 : 10
    return take
}
