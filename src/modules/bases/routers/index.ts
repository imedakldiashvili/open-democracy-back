import * as express from "express";
import BallotTypeControler from "../controllers/BallotTypeControler";

const baseRouter = express.Router();


baseRouter.get("/base/BallotType", BallotTypeControler.getBallotType)
baseRouter.post("/base/BallotType", BallotTypeControler.addBallotType)
baseRouter.put("/base/BallotType", BallotTypeControler.editBallotType)
baseRouter.put("/base/BallotType/Active", BallotTypeControler.setActiveBallotType)
baseRouter.delete("/base/BallotType", BallotTypeControler.deleteBallotType)

export default baseRouter;