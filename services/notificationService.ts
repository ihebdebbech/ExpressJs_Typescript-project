import { PrismaClient, CentralUnit } from "@prisma/client";
const Notification = new PrismaClient().notification;

const user = new PrismaClient().user;
export const createNotificationService = async (notification: any) => {
  try {
    return await Notification.create({
      data: notification,
    });
  } catch (error) {
    throw error;
  }
};
export async function getnotificationsByuserId(userId : number) {
    try {
        const notifData = await Notification.findMany({
            where: {
                userId: userId,
                
            },
            orderBy: {
              createdAt: 'desc', 
            },
            
        });

        
            return notifData;
        
    } catch (error) {
        console.error('Error fetching roomId:', error);
        throw error;
    }
}