import mqtt from "mqtt";
import { createSensorData } from "../controllers/sensorDataController";
import { updateCentralController } from "../controllers/centralUnitController";
import { CentralUnit } from "@prisma/client";
import { createCentralService, getcentralbyuuid } from "../services/centralUnitService";
import { updateroomstatusController } from "../controllers/roomController";
import path from "path";
import fs from "fs";
import { updatecentralStockService } from "../services/stockService";
import { createNotificationService } from "../services/notificationService";
import sendPushNotification from "../middleware/notification";
let mqttClient: mqtt.MqttClient | null = null;
type CentralUnitWithoutId = Omit<CentralUnit, 'id'>;
export const initializeMqttClient = (mqttUrl: string) => {
  if (mqttClient) {
    console.log("MQTT client is already initialized.");
    return;
  }


 mqttClient = mqtt.connect(mqttUrl, {

});

// Handle connection eventt
mqttClient.on('connect', () => {
   
    console.log("Connected to MQTT broker");
    mqttClient?.subscribe("greeny/unit/#", (err) => {
      if (!err) {
        console.log("Subscribed to topic: your/topic/name");
      }
      //const jsonString = JSON.stringify("0893506f-b351-46bc-8b6d-840167858b20");

     // mqttClient?.publish("greeny/unit/birth",jsonString);
    });
  });

  mqttClient.on("message", async (topic: string, message: Buffer) => {
    try { 
    const messageString = message.toString();
    console.log("mqtt message")
console.log(messageString)
  console.log(topic);
   
    
      const parts = topic.split("/");

      if (parts.includes("sensor")) {
        const jsonMessage = JSON.parse(messageString);
        console.log("next is data creaction");
        await createSensorData(topic, jsonMessage);
        //sensor dataaaaaaa

      } else if (parts.includes("birth")  && parts.length == 3) {
        //create central
          
        console.log("birth"); 
        console.log(messageString); 
         const centralUnit: CentralUnitWithoutId = {
           ownerId: 19,
           uuid: messageString,


           label: " Unit 1",
           
           status: "inStock",
           latitude: 36.8469462,
           longitude: 10.1700514
         };
         await createCentralService(centralUnit);
         await updatecentralStockService("centralUnit");
      }
     else if (parts.includes("birth")  && parts.length == 4) {
      //create room

    } else if (parts.includes("status") && parts.length == 3) {
      const jsonMessage = JSON.parse(messageString);
        const centralupdated = await updateCentralController(topic);
        console.log(messageString);
        
        
        //of rasperry status
      } else if (parts.includes("status") && parts.length == 5) {
        console.log("status");
        const jsonMessage = JSON.parse(messageString);
        console.log(jsonMessage);
        const centralupdated = await updateroomstatusController(jsonMessage,topic);
      }
      else if (parts.includes("done") ) {
      
        const uuid = parts[2];
        const central = await getcentralbyuuid(uuid);
        const roomname = parts[3];
        const notif = {
          userId: central?.ownerId,
          title: "Calibration Successful 🧪",
          body: "your sensor  has been successfully calibrated. The new readings are now optimized for accurate measurements. Please monitor the sensor for consistent performance." ,
    
          type: "data",
    
        };
        const notifcreated = await createNotificationService(notif)
        
          const notif2 = await sendPushNotification(notif.title, notif.body, notif.userId);
        
  
      }
    } catch (error) {
      console.error("Failed to parse JSON message:", error);
    }
  });
};

export const getMqttClient = () => {
  if (!mqttClient) {
    throw new Error("MQTT client is not initialized");
  }
  return mqttClient;
};
