import { Request, Response, NextFunction } from 'express'
import { AppError } from './AppError'


export const appErrorHandler = ( err: Error | AppError, req: Request, res: Response, next: NextFunction ) => {
  
  let appError = new AppError(500, "Fatal Error");

  if (err instanceof Error) { 
    const error = (err as Error); 
    appError = new AppError(500, error.message);
  }

  if (err instanceof AppError) { appError = (err as AppError); }

  res.status((appError as AppError).status).send(appError);


};

export default appErrorHandler;