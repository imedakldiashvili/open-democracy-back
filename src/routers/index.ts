import * as express from 'express'
import  baseRouter from '../modules/bases/routers'
import electionRouter from '../modules/elections/routers';

const router = express.Router();

router.use("/", baseRouter, electionRouter)

export default router;