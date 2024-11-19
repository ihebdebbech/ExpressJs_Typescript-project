import express from "express";
import { createSensorData,getSensorDataByTypeAndUserIdController } from "../controllers/sensorDataController";

import { NextFunction, Request, Response } from "express";
const router = express.Router();

router.get("/:sensorType", getSensorDataByTypeAndUserIdController);


export default router;


