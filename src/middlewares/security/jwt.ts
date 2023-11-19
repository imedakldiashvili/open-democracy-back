import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken';


import keys from '../../../keys';
import settings from '../../settings';

import { AppError } from '../error';


import { UserSession } from '../../modules/users/entities';
import { userSessionRepository } from '../../modules/users/repositories';





export const generateToken = (userSession: UserSession) => {
  const secret = keys.ACCESS_TOKEN_SECRET_KEY
  const token = jwt.sign({
    userSession: userSession
  },
    secret,
    {
      expiresIn: settings.ACCESS_TOKEN_DURATION,
    });
  return token;
};


export const generateRefreshToken = (userSession: UserSession) => {
  const secret = keys.REFRESH_TOKEN_SECRET_KEY
  const token = jwt.sign({
    userSession: userSession
  },
    secret,
    {
      expiresIn: settings.REFRESH_TOKEN_DURATION,
    });
  return token;
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const secret = keys.ACCESS_TOKEN_SECRET_KEY
  try {

    let decodedToken;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw AppError.unauthorized("Authorization nedeed - 01");
    }

    const token = authHeader.split(" ")[1];
    try {
      decodedToken = jwt.verify(token, secret);
    } catch (error) {
      throw AppError.unauthorized("Authorization nedeed - 02");
    }

    if (!decodedToken) {
      throw AppError.unauthorized("authorization nedeed - 03");
    } 
    
    if (typeof decodedToken !== "string") {
      const userSession = decodedToken.userSession;
      const activeSessions = await userSessionRepository.find({ where: { id: userSession.id, sessionUid: userSession.sessionUid,deviceUid: userSession.deviceUid, isActive: true  }, relations: { user: true } });
      if (activeSessions.length != 1) {
        throw AppError.unauthorized("session not found");
      }
      req.body.userSession = activeSessions[0]
    }
    next()
  } catch (error) {
    next(error)
  }
};