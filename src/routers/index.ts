import * as express from 'express'
import userRouter from '../modules/users/routers';
import electionRouter from '../modules/elections/routers';
import actionRouter from '../modules/actions/routers';
import voterRouter from '../modules/votings/routers';

const router = express.Router();

router.use("/", electionRouter, userRouter, actionRouter, voterRouter)

export default router;