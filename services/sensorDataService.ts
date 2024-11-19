// services/sensorDataService.ts

import { PrismaClient, Type } from "@prisma/client";

const prisma = new PrismaClient();

export const createSensorDataService = async (

    roomId: number,
    type: any,
    value: GLfloat,
) => {
  try {
    return await prisma.sensorData.create({
      data: {
        roomId,
        type,
        value,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create sensor data: ${error}`);
  }
};
export const getSensorDataByTypeAndUserIdService = async (

  sensorType: any,
  ownerId: number,

) => {
try {
 
  return  await prisma.sensorData.findMany({
        where: {
          type: sensorType,
          room: {
            centralUnit: {
              ownerId: ownerId,  // Filter by the user's ID
            },
          },
        },
        
        orderBy: {
          timestamp: 'asc',  // Order by timestamp in ascending order
        },
      });
  
      
    
} catch (error) {
  throw new Error(`Failed to create sensor data: ${error}`);
}
};
