// controllers/sensorDataController.ts

import { Request, Response } from "express";
import { createSensorDataService, getSensorDataByTypeAndUserIdService } from "../services/sensorDataService";
import {
  getRoomIdByCentralUnitUuid,
  updateroomService,
} from "../services/roomService";
import { Notification, Type } from "@prisma/client";
import { getMqttClient } from "../mqtt/mqttClient";
import { getcentralbyuuid } from "../services/centralUnitService";
import sendPushNotification from "../middleware/notification";
import { createNotificationService } from "../services/notificationService";
import { StatusCodes } from "http-status-codes";

export const createSensorData = async (topic: String, message: any) => {
  try {
    const parts = topic.split("/");
    const uuid = parts[2];
    const room = parts[3];
    var sensorType = parts[4];
    console.log("verify room")
    const roomId = await getRoomIdByCentralUnitUuid(uuid, room);

    console.log(message.Last_mesure);
    if (sensorType == "temperature") {
      sensorType = "airTemp";
    } else if (sensorType == "water_temp") {
      sensorType = "waterTemp";
      message.Last_mesure = (message.Last_mesure * 100) / 4000;
    } else if (sensorType == "air_quality") {
      sensorType = "co2";
    }
    console.log("now create data")
    // If validation passes, proceed with creating the sensor data
    const sensorData = await createSensorDataService(
      roomId,
      sensorType,
      message.Last_mesure
    );
    const updatedRoom = await updateroomService(
      roomId,
      sensorType,
      message.Last_mesure
    );
    const mqttclient = getMqttClient();
    const central = await getcentralbyuuid(uuid);
    const notif = {
      userId: central?.ownerId,
      title: "New Data 📊",
      body: "new  Data  value for " + updatedRoom.name,

      type: "data",

    };
    const notifcreated = await createNotificationService(notif)
    if (sensorType == "ph") {

      const notif2 = await sendPushNotification(notif.title, notif.body, notif.userId);
    }
    console.log("all good")
    //  mqttclient?.publish('greeny/unit/0893506f-b351-46bc-8b6d-840167858b20/room1/ph/command', JSON.stringify({ "phdown": "90" }));

    return true;
  } catch (error) {
    console.log("errorrr in data creation")
    console.log(error);
    return false;
  }
};
export async function getSensorDataByTypeAndUserIdController(req: Request, res: Response) {
  try {
    const { sensorType } = req.params;
    const ownerId = parseInt(req.headers.userid as string, 10);
     const sensorData = await getSensorDataByTypeAndUserIdService(sensorType,ownerId);
    return res.status(StatusCodes.ACCEPTED).json({ sensorData });
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    throw error;
  }
}
