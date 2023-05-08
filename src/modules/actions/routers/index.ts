import * as express from "express";
import ActionController from "../controllers";


const actionRouter = express.Router();


actionRouter.post("/actions/Add", ActionController.addActions)
actionRouter.post("/actions/findAll", ActionController.getUserAllActions)
actionRouter.post("/actions/findRecent", ActionController.getUserRecentActions)

export default actionRouter;