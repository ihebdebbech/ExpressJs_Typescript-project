import express from "express";
import { createRoom,getAllroomsbyUserId, publishPhDown, publishSolution, publishWatercycle,publishEcCallibration,publishPhCallibration} from "../controllers/roomController";

import { NextFunction, Request, Response } from "express";


const router = express.Router();
router.post("/", createRoom);
router.get("/roomsbyownerid", getAllroomsbyUserId);
router.post("/commandph",publishPhDown);
router.post("/commandsol",publishSolution);
router.post("/commandwatercycle",publishWatercycle);
router.post("/callibrateph",publishPhCallibration);
router.post("/callibrateec",publishEcCallibration);
export default router;


