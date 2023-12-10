import * as express from "express";

import DonationController from "../controlers/DonationController";


const donationRouter = express.Router();
donationRouter.get("/donations/publiclist", DonationController.donationsPublicList)


export default donationRouter;