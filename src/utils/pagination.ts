export const getPageIndex = (pagination) => {
    const skip = pagination ?  pagination.pageIndex ? parseInt(pagination.pageIndex.toString()) : 1 : 1
    return skip
}

export const getPageSize = (pagination) => {
    const skip = pagination ?  pagination.pageSize ? parseInt(pagination.pageSize.toString()) : 10 : 10
    return skip
}
