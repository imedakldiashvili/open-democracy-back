import * as express from "express";
import ActionController from "../controllers";


const actionRouter = express.Router();


actionRouter.post("/actions/Add", ActionController.add)
actionRouter.post("/actions/findDetail", ActionController.findDetail)
actionRouter.post("/actions/findRecentByUser", ActionController.findRecentByUser)
actionRouter.post("/actions/findAllByUser", ActionController.findAllByUser)



export default actionRouter;