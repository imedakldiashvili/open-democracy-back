import { AppError } from "./AppError";

export const throwNotImplement = () => { throw AppError.badRequest("not_implement") };
export const throwBadRequest = ( message: string) => { throw AppError.badRequest(message) };
export const throwNotFound = ( message: string) => { throw AppError.badRequest(message) };
export const throwInternalError = ( message: string) => { throw AppError.badRequest(message) };