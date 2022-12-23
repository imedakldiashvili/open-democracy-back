import { NextFunction, Request, Response } from 'express'

import { AppError } from '../../../middlewares/error';

import { User, UserPassword } from '../entities';

import { userPasswordRepository, userRepository } from '../repositories';





class UserController {
    static find = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userRepository.find();
            return res.json(users);
        } catch (error) {
            next(error)
        }

    };

    static findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const user = await userRepository.findOneBy({id: id});
            return res.json(user);
        } catch (error) {
            next(error)
        }

    };

    static edit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static setActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default UserController;