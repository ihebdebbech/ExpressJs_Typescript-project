// controllers/roomController.ts

import { Request, Response } from "express";
import { createroomService ,getRoomByOwnerId, updateCalibrationStatusService, updateRoomStatusService} from "../services/roomService";
import { getRoomIdByCentralUnitUuid, updateroomService} from "../services/roomService";
import { StatusCodes } from "http-status-codes";
import mqtt from "mqtt/*";

import {getMqttClient} from "../mqtt/mqttClient";


export const createRoom = async (req: Request, res: Response) => {
    try {
        const {
            name,
            roomTopic,
            plantName,
            centralUnitUuid,
            neededPh,
            neededEc,
            neededAirTemp,
            neededCo2,
            neededHumidity,
            neededWaterTemp,
            quantitySolA,
            quantitySolB,
            quantityPhDown,
            waterPumpSchedule,
            waterRunningTime,
        } = req.body;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Name is required and must be a string." });
        }
        if (!roomTopic || typeof roomTopic !== "string") {
            return res.status(400).json({ error: "Room topic is required and must be a string." });
        }
        if (!plantName || typeof plantName !== "string") {
            return res.status(400).json({ error: "Plant name is required and must be a string." });
        }
        if (!centralUnitUuid || typeof centralUnitUuid !== "string") {
            return res.status(400).json({ error: "Central unit UUID is required and must be a string." });
        }
        if (!Array.isArray(neededPh)) {
            return res.status(400).json({ error: "Needed pH must be an array of floats." });
        }
        if (!Array.isArray(neededEc)) {
            return res.status(400).json({ error: "Needed EC must be an array of floats." });
        }
        const room = await createroomService(
            name,
            roomTopic,
            plantName,
            centralUnitUuid,
            neededPh,
            neededEc,
            neededAirTemp,
            neededCo2,
            neededHumidity,
            neededWaterTemp,
            quantitySolA,
            quantitySolB,
            quantityPhDown,
            waterPumpSchedule,
            waterRunningTime
        );

        res.status(201).json({ message: " successfull room creation " });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "failed to create" });
    }
};

export const getAllroomsbyUserId = async (req: Request, res: Response) => {
    try {
        const ownerId = parseInt(req.headers.userid as string, 10); ;
      const rooms = await getRoomByOwnerId(ownerId);
    
      if(rooms.length > 0){
        return res
        .status(StatusCodes.OK)
        .json({ rooms});
      }else{
        return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No rooms found" });
      }
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while getting the rooms" });
    }
  };
  export const  publishPhDown = async (req: Request, res: Response) => {

    try{
        const mqttclient = getMqttClient();
    const {uuid,roomTopic, quantity } = req.body;


    const Topic = "greeny/unit/"+uuid+"/"+roomTopic+"/ph/command";
   // client.publish("0893506f-b351-46bc-8b6d-840167858b20/room1/ph/command",("Mr ambassadeurr"))
    // Convert the message object to a JSON string
    const jsonString = JSON.stringify({"PH_down" : quantity});

    // Publish the JSON string to the MQTT broker
    mqttclient.publish(Topic, jsonString, (err) => {
        if (err) {
            console.error('Failed to publish:', err);
            res.status(500).send('Failed to publish message');
        } else {
            console.log(`Message published to topic ${Topic}`);
            res.status(200).send('Message published successfully');
        }
    });
}catch(err){
    console.log(err);
    res.status(500).send('Failed to publish message');
}
}

export const  publishSolution = async (req: Request, res: Response) => {

const mqttclient = getMqttClient();
    const {uuid,roomTopic, quantityA,quantityB } = req.body;


    
    const jsonString = JSON.stringify({"solA" : quantityA,"solB" : quantityB});
    const Topic  = "greeny/unit/"+uuid+"/"+roomTopic+"/ec/command"
        
    


    // Publish the JSON string to the MQTT broker
    mqttclient.publish(Topic, jsonString, (err) => {
        if (err) {
            console.error('Failed to publish:', err);
            res.status(500).send('Failed to publish message');
        } else {
            console.log(`Message published to topic ${Topic}`);
            res.status(200).send('Message published successfully');
        }
    });
}
export const updateroomstatusController = async (jsonMessage : string ,topic: string) => {
    try {
      const parts = topic.split("/");
      const uuid = parts[2];
      const roomname = parts[3]
  
      const updatedroom = await updateRoomStatusService(jsonMessage,uuid,roomname);
      return updatedroom;
    } catch (error) {
      return;
    }
  };
export const  publishWatercycle = async (req: Request, res: Response) => {
    const mqttclient = getMqttClient();
        const {uuid,roomTopic, duration , intervale } = req.body;

    const Topic = "greeny/unit/"+uuid+"/"+roomTopic+"/waterLevel/command";
   // client.publish("0893506f-b351-46bc-8b6d-840167858b20/room1/ph/command",("Mr ambassadeurr"))
    // Convert the message object to a JSON string
    const jsonString = JSON.stringify({"duration" : duration , "interval" : intervale});

    // Publish the JSON string to the MQTT broker
    mqttclient.publish(Topic, jsonString, (err) => {
        if (err) {
            console.error('Failed to publish:', err);
            res.status(500).send('Failed to publish message');
        } else {
            console.log(`Message published to topic ${Topic}`);
            res.status(200).send('Message published successfully');
        }
    });
}
export const  publishPhCallibration = async (req: Request, res: Response) => {

    try{
        const mqttclient = getMqttClient();
        const {uuid,roomTopic } = req.body;


        const Topic = "greeny/unit/"+uuid+"/"+roomTopic+"/ph/callibration";
       // client.publish("0893506f-b351-46bc-8b6d-840167858b20/room1/ph/command",("Mr ambassadeurr"))
        // Convert the message object to a JSON string
        const jsonString = JSON.stringify({"callibration" : "on"});

    // Publish the JSON string to the MQTT broker
    mqttclient.publish(Topic, jsonString, async (err) => {
        if (err) {
            console.error('Failed to publish:', err);
           return res.status(500).send('Failed to publish message');
        } else {
            console.log(`Message published to topic ${Topic}`);
            const updatedroom = await updateCalibrationStatusService("ph",uuid,roomTopic);

          return  res.status(200).send('Message published successfully');
        }
    });
}catch(err){
    console.log(err);
    res.status(500).send('Failed to publish message');
}
}
export const  publishEcCallibration = async (req: Request, res: Response) => {

    try{
        const mqttclient = getMqttClient();
    const {uuid,roomTopic } = req.body;


    const Topic = "greeny/unit/"+uuid+"/"+roomTopic+"/ec/callibration";
   // client.publish("0893506f-b351-46bc-8b6d-840167858b20/room1/ph/command",("Mr ambassadeurr"))
    // Convert the message object to a JSON string
    const jsonString = JSON.stringify({"callibration" : "on"});

    // Publish the JSON string to the MQTT broker
    mqttclient.publish(Topic, jsonString, async (err) => {
        if (err) {
            console.error('Failed to publish:', err);
          return  res.status(500).send('Failed to publish message');
        } else {
            console.log(`Message published to topic ${Topic}`);
            const updatedroom = await updateCalibrationStatusService("ec",uuid,roomTopic);

           return res.status(200).send('Message published successfully');
        }
    });

}catch(err){
    console.log(err);
    res.status(500).send('Failed to publish message');
}
}

