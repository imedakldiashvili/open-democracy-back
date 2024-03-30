import * as express from 'express'

import authRouter from '../modules/auth/routes';
import userRouter from '../modules/users/routers';
import electionRouter from '../modules/elections/routers';
import actionRouter from '../modules/actions/routers';
import voterRouter from '../modules/votings/routers';
import donationRouter from '../modules/donations/routes';
import publicRouter from '../modules/public/routes';
import notificationRouter from '../modules/notifications/routes';

const router = express.Router();

router.use("/", authRouter, electionRouter, userRouter, actionRouter, voterRouter, donationRouter, publicRouter, notificationRouter)

export default router;