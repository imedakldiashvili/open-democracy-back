import * as express from "express";
import BallotTypeControler from "../controllers/BallotTypeControler";

const baseRouter = express.Router();


baseRouter.get("/base/getBallotTypeControler", BallotTypeControler.getBallotTypeControler)
baseRouter.post("/base/addBallotTypeControler", BallotTypeControler.addBallotTypeControler)

export default baseRouter;