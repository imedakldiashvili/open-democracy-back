import * as express from 'express'
import electionRouter from '../modules/elections/routers';
import userRouter from '../modules/users/routers';
import actionRouter from '../modules/actions/routers';

const router = express.Router();

router.use("/", electionRouter, userRouter, actionRouter)

export default router;