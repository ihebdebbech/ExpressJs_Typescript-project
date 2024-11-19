// services/sensorDataService.ts

import { PrismaClient, Type } from "@prisma/client";

const prisma = new PrismaClient();

export const addtransaction = async (

    paymentref: any,
    type: any,
    amount: GLfloat,
    currency : string,
    userId:number
) => {
  try {
    return await prisma.transaction.create({
      data: {
        id : paymentref,
       amount : amount,
       type : type,
       userId : userId,
       currency : currency
      },
    });
  } catch (error) {
    throw new Error(`Failed to create sensor data: ${error}`);
  }
};

export const updatetransaction = async (

    paymentref: any,
    
) => {
  try {
    const datenow = new Date();
    return await prisma.transaction.update({
        where : {
            id : paymentref
        },
      data: {
       status : "COMPLETED",
       user: { // Assuming there's a user relation on transaction
        update: {
            premium : true,
            paymentdate: datenow , 
                  
        }
      },
    },
  });
  } catch (error) {
    throw new Error(`Failed to create sensor data: ${error}`);
  }
};
