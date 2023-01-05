import * as express from 'express'
import baseRouter from '../modules/bases/routers'
import electionRouter from '../modules/elections/routers';
import otpRouter from '../modules/otps/routes';
import userRouter from '../modules/users/routers';

const router = express.Router();

router.use("/", baseRouter, electionRouter, otpRouter, userRouter)

export default router;