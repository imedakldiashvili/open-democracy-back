import * as express from "express";
import ActionController from "../controllers";


const actionRouter = express.Router();


actionRouter.post("/actions/Add", ActionController.addActions)
actionRouter.post("/actions/findUserDetail", ActionController.getUserActionDetail)
actionRouter.post("/actions/findUserAll", ActionController.getUserAllActions)
actionRouter.post("/actions/findUserRecent", ActionController.getUserRecentActions)



export default actionRouter;