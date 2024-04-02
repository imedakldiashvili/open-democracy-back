import * as express from "express";
import { RegionController, DistrictController } from "../controllers";



const locationRouter = express.Router();

locationRouter.post("/locations/fingRegions", RegionController.fingRegions)
locationRouter.post("/locations/findDistrictsByRegionId", DistrictController.findDistrictsByRegionId)

export default locationRouter