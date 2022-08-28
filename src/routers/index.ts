import * as express from 'express'
import  baseRouter from '../modules/bases/routers'

const router = express.Router();

router.use("/", baseRouter)

export default router;