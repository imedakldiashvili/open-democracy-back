import * as express from "express";
import { RegionController, DistrictController } from "../controllers";



const locationRouter = express.Router();

locationRouter.post("/Regions/find", RegionController.findAll)
locationRouter.post("/Districts/findByRegionId", DistrictController.findByRegionId)

export default locationRouter