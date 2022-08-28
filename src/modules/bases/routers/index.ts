import * as express from "express";
import { BallotTypeController } from "../controllers";

const baseRouter = express.Router();

baseRouter.get("/base/BallotsTypes", BallotTypeController.getBallotType)
baseRouter.get("/base/BallotsTypes/:id", BallotTypeController.getBallotTypeById)
baseRouter.post("/base/BallotsTypes", BallotTypeController.addBallotType)
baseRouter.put("/base/BallotsTypes", BallotTypeController.editBallotType)
baseRouter.put("/base/BallotsTypes/Active", BallotTypeController.setActiveBallotType)
baseRouter.delete("/base/BallotsTypes", BallotTypeController.deleteBallotType)

export default baseRouter;