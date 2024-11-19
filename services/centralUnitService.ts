import { PrismaClient, CentralUnit } from "@prisma/client";
import { createNotificationService } from "./notificationService";
import sendPushNotification from "../middleware/notification";
const central = new PrismaClient().centralUnit;
type CentralUnitWithoutId = Omit<CentralUnit, 'id'>;
const user = new PrismaClient().user;
export const createCentralService = async (centralRequest: CentralUnitWithoutId) => {
  try {
    return await central.create({
      data: centralRequest,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllCentralUnitService = async () => {
  try {
    return await central.findMany({
      include: {
        owner: {
          select: {
            username: true,
          },
        },

        _count: {
          select: {
            Rooms: true,
          },
        },
      },
    });
  } catch (e) {
    return null;
  }
};


export const affectCentralservice = async (uuid : string,useremail : string,latitude : GLfloat,longitude : GLfloat) => {
  try {
    const centraldata = await central.findFirst({
      where: { uuid: uuid },
    });
    const userdata = await user.findFirst({
      where : {
        email : useremail,
      }
    });
    if (centraldata && userdata) {
   
        const element = await central.update({
          where: { uuid: uuid },
          data: {
            ownerId : userdata.id,
            latitude : latitude,
            longitude : longitude,
            status : "active",
          },
        });
        console.log(element);

        return element;
      
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to update central:", error);
    throw error;
  }
};
export const getcentralbyuuid = async (uuidcentral: string) => {
  try {
    const centraldata = await central.findFirst({
      where: { uuid: uuidcentral },
    });
    if (centraldata) {
      return centraldata;
    } 
  } catch (error) {
    console.error("Failed to update central:", error);
    throw error;
  }
};
export const updateCentralService = async (centreId: string) => {
  try {
    const centraldata = await central.findFirst({
      where: { uuid: centreId },
    });
    if (centraldata) {
      if (centraldata.status == "active") {
        const element = await central.update({
          where: { uuid: centreId },
          data: {
            status: "inactive",
          },
        });
        console.log(element);
        
    
        const notif = {
          userId: centraldata?.ownerId,
          title: "Farm Status 🚨",
          body : "you farm became inactive , please check the system  or your plants will be in danger",
    
          type: "alert",
          
        };
        const notifcreated = await createNotificationService(notif)
        const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
        

        return element;
      } else {
        const element = await central.update({
          where: { uuid: centreId },
          data: {
            status: "active",
          },
        });
        console.log(element);
        const notif = {
          userId: centraldata?.ownerId,
          title: "Farm Status ✅",
          body : " you farm is now active again",
    
          type: "alert",
          
        };
        const notifcreated = await createNotificationService(notif)
        const notif2 = await sendPushNotification(notif.title,notif.body,notif.userId);
        
        return element;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to update central:", error);
    throw error;
  }
};

export const getCentralsPourcentageStatus = async () => {
  try {
    const centrals = await central.findMany();

    const totalCentrals = centrals.length;

    if (totalCentrals === 0) {
      return {
        active: 0,
        inactive: 0,
        inStock: 0,
        maintenance: 0,
      };
    }

    const statusCounts = {
      active: centrals.filter((central) => central.status === "active").length,
      inactive: centrals.filter((central) => central.status === "inactive")
        .length,
      inStock: centrals.filter((central) => central.status === "inStock")
        .length,
      maintenance: centrals.filter(
        (central) => central.status === "maintenance"
      ).length,
    };

    const statusPercentages = {
      active: parseFloat(
        ((statusCounts.active / totalCentrals) * 100).toFixed(2)
      ),
      inactive: parseFloat(
        ((statusCounts.inactive / totalCentrals) * 100).toFixed(2)
      ),
      inStock: parseFloat(
        ((statusCounts.inStock / totalCentrals) * 100).toFixed(2)
      ),
      maintenance: parseFloat(
        ((statusCounts.maintenance / totalCentrals) * 100).toFixed(2)
      ),
    };

    return statusPercentages;
  } catch (e) {
    console.error(e);
    return null;
  }
};
