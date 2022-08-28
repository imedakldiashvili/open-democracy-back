import * as express from "express";
import BallotTypeControler from "../controllers/BallotTypeControler";

const baseRouter = express.Router();

baseRouter.get("/base/BallotsTypes", BallotTypeControler.getBallotType)
baseRouter.get("/base/BallotsTypes/:id", BallotTypeControler.getBallotTypeById)
baseRouter.post("/base/BallotsTypes", BallotTypeControler.addBallotType)
baseRouter.put("/base/BallotsTypes", BallotTypeControler.editBallotType)
baseRouter.put("/base/BallotsTypes/Active", BallotTypeControler.setActiveBallotType)
baseRouter.delete("/base/BallotsTypes", BallotTypeControler.deleteBallotType)

export default baseRouter;