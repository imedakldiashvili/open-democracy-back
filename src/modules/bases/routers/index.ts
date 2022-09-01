import * as express from "express";
import { BallotTypeController, PollingStationController } from "../controllers";
import DistrictControler from "../controllers/DistrictController";
import RegionController from "../controllers/Region";
import VoterController from "../controllers/Voter";

const baseRouter = express.Router();


baseRouter.get("/base/BallotsTypes", BallotTypeController.getBallotType)
baseRouter.get("/base/BallotsTypes/:id", BallotTypeController.getBallotTypeById)
baseRouter.post("/base/BallotsTypes", BallotTypeController.addBallotType)
baseRouter.put("/base/BallotsTypes", BallotTypeController.editBallotType)
baseRouter.put("/base/BallotsTypes/Active", BallotTypeController.setActiveBallotType)
baseRouter.delete("/base/BallotsTypes", BallotTypeController.deleteBallotType)


baseRouter.get("/base/PollingsStations", PollingStationController.getPollingStation)
baseRouter.get("/base/PollingsStations/:id", PollingStationController.getPollingStationById)
baseRouter.get("/base/PollingsStations/ByDistrict/:districtId", PollingStationController.getPollingStationByDiscrictId)
baseRouter.post("/base/PollingsStations", PollingStationController.addPollingStation)
baseRouter.put("/base/PollingsStations", PollingStationController.editPollingStation)
baseRouter.put("/base/PollingsStations/Active", PollingStationController.setActivePollingStation)
baseRouter.delete("/base/PollingsStations", PollingStationController.deletePollingStation)


baseRouter.get("/base/Regions", RegionController.getRegion)
baseRouter.get("/base/Regions/:id", RegionController.getRegionById)
baseRouter.post("/base/Regions", RegionController.addRegion)
baseRouter.put("/base/Regions", RegionController.editRegion)
baseRouter.put("/base/Regions/Active", RegionController.setActiveRegion)
baseRouter.delete("/base/Regions", RegionController.deleteRegion)


baseRouter.get("/base/Districts", DistrictControler.getDistrict)
baseRouter.get("/base/Districts/:id", DistrictControler.getDistrictById)
baseRouter.get("/base/Districts/ByRegion/:regionId", DistrictControler.getDistrictByRegionId)
baseRouter.post("/base/Districts", DistrictControler.addDistrict)
baseRouter.put("/base/Districts", DistrictControler.editDistrict)
baseRouter.put("/base/Districts/Active", DistrictControler.setActiveDistrict)
baseRouter.delete("/base/Districts", DistrictControler.deleteDistrict)


baseRouter.get("/base/Voters", VoterController.getVoter)
baseRouter.get("/base/Voters/:id", VoterController.getVoterById)
baseRouter.post("/base/Voters", VoterController.addVoter)
baseRouter.put("/base/Voters", VoterController.editVoter)
baseRouter.put("/base/Voters/Active", VoterController.setActiveVoter)
baseRouter.delete("/base/Voters", VoterController.deleteVoter)


export default baseRouter;