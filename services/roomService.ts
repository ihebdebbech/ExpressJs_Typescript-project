import { PrismaClient } from "@prisma/client";
import { createNotificationService } from "./notificationService";
import sendPushNotification from "../middleware/notification";
import { getcentralbyuuid } from "./centralUnitService";

const prisma = new PrismaClient();
const room = prisma.room;
const central = new PrismaClient().centralUnit;

export const createroomService = async (
    name: string,
    roomTopic: string,
    plantName: string,
    centralUnitUuid: string,
    neededPh: GLfloat[],
    neededEc: GLfloat[],
    neededAirTemp: GLfloat[],
    neededCo2: GLfloat[],
    neededHumidity: GLfloat[],
    neededWaterTemp: GLfloat[],
    quantitySolA: number,
    quantitySolB: number,
    quantityPhDown: number,
    waterPumpSchedule: number,
    waterRunningTime: number
) => {
    try {
        return await room.create({
            data: {
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
                QuantityPhDown: quantityPhDown, // Ensure the attribute matches your schema
                waterPumpSchedule,
                waterRunningTime,
            },
        });
    } catch (error) {
        throw error;
    }
};

export async function getRoomIdByCentralUnitUuid(centralUnitUuid : string, roomT : string) {
    try {
        const roomData = await room.findFirst({
            where: {
                centralUnitUuid: centralUnitUuid,
                roomTopic  : roomT,
            },
            select: {
                id: true, // Select only the roomId
            },
        });

        if (roomData) {
            return roomData.id;
        } else {
            throw new Error('Room not found');
        }
    } catch (error) {
        console.error('Error fetching roomId:', error);
        throw error;
    }
}
export const updateRoomStatusService = async (jsonMessage :any,centreId: string,roomtopicname : string) => {
    try {
      const centraldata = await central.findFirst({
        where: { uuid: centreId },
      });
      if (centraldata) {
        const roomdata = await room.findFirst({
            where: { centralUnitUuid: centreId, roomTopic : roomtopicname },
        });
        if(roomdata){
        if(jsonMessage.status == "disconnected"){
            console.log("consult roomdata")
            console.log(roomdata)
            
                const element = await room.update({
                  where: { id: roomdata.id },
                  data: {
                    Status: "inactive",
                  },
                });
                console.log(element);
                
            
                const notif = {
                  userId: centraldata?.ownerId,
                  title: roomdata.name +" Status 🚨",
                  body : " your"+roomdata.name +" became inactive , please check the system  or your plants will be in danger",
            
                  type: "alert",
                  
                };
                const notifcreated = await createNotificationService(notif)
                const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
                
        
                return element;
              } else {
                const element = await room.update({
                    where: { id: roomdata.id },
                  data: {
                    Status: "active",
                  },
                });
                console.log(element);
                const notif = {
                  userId: centraldata?.ownerId,
                  title: roomdata.name +" Status ✅",
                  body : " you "+roomdata.name +" is now active again",
            
                  type: "alert",
                  
                };
                const notifcreated = await createNotificationService(notif)
                const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
                
                return element;
              }
            
        }
        else{
            return await room.create({
                data: {
                    name : "greenhouse"+ roomtopicname,
                    roomTopic :roomtopicname ,
                    plantName : "tomato" ,
                    centralUnitUuid : centreId,
                    neededPh : [6.5,7.5],
                    neededEc : [6.5,7.5],
                    neededAirTemp : [20.5,24.5],
                    neededCo2 :[6.5,7.5],
                    neededHumidity : [6.5,7.5],
                    neededWaterTemp : [20.5,24.5],
                    quantitySolA : 20,
                    quantitySolB : 20,
                    QuantityPhDown:  7, // Ensure the attribute matches your schema
                    waterPumpSchedule : 100,
                    waterRunningTime : 20 ,
                },
            });
        }
    }
    else {
        return false;
      }
    }
     catch (error) {
      console.error("Failed to update central:", error);
      throw error;
    }
  };
export const updateroomService = async (
    roomId : number,
    type : string,
    value : GLfloat,
) => {
    try {
        if(type == "ph"){
            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestPh :value,
                },
            });
        }
        else if(type == "ec"){
            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestEc :value,
                },
            });
        }else if(type == "co2"){
            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestCo2 :value,
                },
            });
        }else if(type == "waterLevel"){
            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestWaterLevel :value,
                },
            });
        }else if(type == "humidity"){

            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestHumidity :value,
                },
            });
        }else if(type == "airTemp"){
            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestAirTemp :value,
                },
            });
        }else if(type == "waterTemp"){
            return await room.update({
                where : {
    id:roomId
                },
                data: {
           latestWaterTemp :value,
                },
            });
        }
        else {
            throw "error";
        }
       
    } catch (error) {
        throw error;
    }
};

export async function getRoomByOwnerId(ownerId: number) {
    try {
        // Fetch the Room using the CentralUnit's ownerId in a single query
        const rooms = await prisma.room.findMany({
            where: {
                centralUnit: {
                    ownerId: ownerId,
                },
            },
        });

            return rooms;
        
    } catch (error) {
        console.error('Error fetching rooms by ownerId:', error);
        throw error;
    }
}
export const updateCalibrationStatusService = async (type :string,centreId: string,roomtopicname : string) => {
    try {
     
        const roomdata = await room.findFirst({
            where: { centralUnitUuid: centreId, roomTopic : roomtopicname },
        });
        if(roomdata){
        if(type == "ph"){
            const datenow = new Date();  
                const element = await room.update({
                  where: { id: roomdata.id },
                  data: {
                    latestCalibrationPh: datenow,
                  },
                });
                return element;
              } else if(type == "ec") {
                const datenow = new Date();
                                const element = await room.update({
                    where: { id: roomdata.id },
                  data: {
                    latestCalibrationEc: datenow,
                  },
                });
                    return element;
              }
            
        }
        
    

      return false;
    }
     catch (error) {
      console.error("Failed to update central:", error);
      throw error;
    }
  };


  export const checkCallibrationdatePh = async () => {
    try {
        const now = new Date();
        const rooms = await room.findMany();
  
        rooms.forEach(async (room) => {
          if (!room.latestCalibrationPh) {
            console.log(`Ph sensor for  ${room.name} needs calibration. No previous calibration found.`);
            const centraldata = await getcentralbyuuid(room.centralUnitUuid);
            const notif = {
              userId: centraldata?.ownerId,
              title: "Calibration Time ⚠️",
              body : "it's been more than a week since your last calibration for  your Ph sensor in "+room.name +". Please recalibrate your sensor to keep getting accurate data 🧪",
        
              type: "alert",
              
            };
            const notifcreated = await createNotificationService(notif)
            const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
            
          } else {
            const calibrationTime = new Date(room.latestCalibrationPh);
            const timeDiff = now.getTime() - calibrationTime.getTime();
    
            if (timeDiff > 10 * 60 * 1000) { 
              console.log(`Room ${room.name} needs recalibration. Last calibration was more than 5 minutes ago.`);
              const centraldata = await getcentralbyuuid(room.centralUnitUuid);
              const notif = {
                userId: centraldata?.ownerId,
                title: " Calibration Time ⚠️",
                body : "it's been more than a week since your last calibration for  your Ph sensor in "+room.name +". Please recalibrate your sensor to keep getting accurate data 🧪",
          
                type: "alert",
                
              };
              const notifcreated = await createNotificationService(notif)
              const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
              
            } else {
              console.log(`Room ${room.name} is calibrated recently.`);
            }
          }
        });
    }
     catch (error) {
      console.error("Failed to update central:", error);
      throw error;
    }
  };
  export const checkCallibrationdateEc = async () => {
    try {
        const now = new Date();
        const rooms = await room.findMany();
  
        rooms.forEach(async (room) => {
          if (!room.latestCalibrationPh) {
            console.log(`ec sensor for  ${room.name} needs calibration. No previous calibration found.`);
            const centraldata = await getcentralbyuuid(room.centralUnitUuid);
              const notif = {
                userId: centraldata?.ownerId,
                title: " Calibration Time ⚠️",
                body : "it's been more than a week since your last calibration for  your Ec sensor in "+room.name +". Please recalibrate your sensor to keep getting accurate data 🧪",
          
                type: "alert",
                
              };
              const notifcreated = await createNotificationService(notif)
              const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
              
          } else {
            const calibrationTime = new Date(room.latestCalibrationPh);
            const timeDiff = now.getTime() - calibrationTime.getTime();
    
            if (timeDiff > 10 * 60 * 1000) { 
              console.log(`Room ${room.name} needs recalibration. Last calibration was more than 5 minutes ago.`);
              const centraldata = await getcentralbyuuid(room.centralUnitUuid);
              const notif = {
                userId: centraldata?.ownerId,
                title: " Calibration Time ⚠️",
                body : "it's been more than a week since your last calibration for  your Ec sensor in "+room.name +". Please recalibrate your sensor to keep getting accurate data 🧪",
          
                type: "alert",
                
              };
              const notifcreated = await createNotificationService(notif)

              const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
              
            } else {
              console.log(`Room ${room.name} is calibrated recently.`);
            }
          }
        });
    }
     catch (error) {
      console.error("Failed to update central:", error);
      throw error;
    }
  };

