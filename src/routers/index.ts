import * as express from 'express'
import authRouter from '../modules/auth/routes';
import baseRouter from '../modules/bases/routers'
import electionRouter from '../modules/elections/routers';
import otpRouter from '../modules/otps/routes';
import userRouter from '../modules/users/routers';

const router = express.Router();

router.use("/", baseRouter, electionRouter, otpRouter, authRouter, userRouter)

export default router;