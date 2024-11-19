
import { updatefcmtokenuserService } from '../services/userService';
import { PrismaClient } from '@prisma/client';
const user = new PrismaClient().user;

 
import * as admin from 'firebase-admin';
import * as serviceAccount from '../greenysol-firebase-adminsdk-joi3b-4fb3ececd4.json';
import * as serviceAccountTechnician from '../greeny-solutions-technician-firebase-adminsdk-8g6no-db963ba4ed.json'; // Adjust the path if necessary

// Initialize the default Firebase app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://greeny-solutions.firebaseio.com" // Replace with your database URL
  });
}

// Initialize the second Firebase app with a unique name
if (!admin.apps.find(app => app?.name === 'technicianApp')) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountTechnician as admin.ServiceAccount),
    databaseURL: "https://greeny-solutions-technician.firebaseio.com" // Replace with your technician database URL
  }, 'technicianApp');  // Unique name for the technician app
}
 export default async function sendPushNotification(
    title: string,
    body: string,
    userId : any
  ): Promise<void> {
    try {
      
    let userfound = await user.findFirst({ where: { id: userId } });
   // const token = "e2IXEfdXQD2qwmy43iM0u-:APA91bEvuWym6S46aEMCyR_F8bnfUB9YftHeVwga6GQ2leEtce15CMpLhPAJVBztzCzEtEYzy88SCfdRKr9AU1Gli3MH8oz2yOIC40uESNzfvSfqsoRO7oJhvvjtw-AY1er9VYjARZoQ";
    //const fcmtoken = await updatefcmtokenuserService(24, token);

    if (userfound?.fcmToken.length == 0) {
      throw new Error('This is an invalid token');
    }
    else{
    
        userfound?.fcmToken.map(async token => {
          try{
    const message = {
      notification: {
        title,
        body,
      },
      android: {
        notification: {
          channel_id: 'MESSAGE_CHANNEL',
          icon: 'message_icon',       
          priority: "high" as const,
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 2,
            sound: 'chime.caf', 
          },
        },
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        type: 'MESSAGE',
      },
      token,
    };
  
    
      const response = await admin.messaging().send(message);
      console.log('Notification sent successfully:', response);
    } catch (err) {
      // Catch individual token errors and handle them
      console.error('Error sending notification:');
    }
    });
}
    } catch (error) {
      console.error('Error sending notification:');
    }
  }
  export  async function sendPushNotificationTechnician(
    title: string,
    body: string,
    userId : any
  ): Promise<void> {
    try {
      
    let userfound = await user.findFirst({ where: { id: userId } });
   // const token = "e2IXEfdXQD2qwmy43iM0u-:APA91bEvuWym6S46aEMCyR_F8bnfUB9YftHeVwga6GQ2leEtce15CMpLhPAJVBztzCzEtEYzy88SCfdRKr9AU1Gli3MH8oz2yOIC40uESNzfvSfqsoRO7oJhvvjtw-AY1er9VYjARZoQ";
    //const fcmtoken = await updatefcmtokenuserService(24, token);

    if (userfound?.fcmToken.length == 0) {
      throw new Error('This is an invalid token');
    }
    else{
    
        userfound?.fcmToken.map(async token => {
  
    const message = {
      notification: {
        title,
        body,
      },
      android: {
        notification: {
          channel_id: 'MESSAGE_CHANNEL',
          icon: 'message_icon',       
          priority: "high" as const,
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 2,
            sound: 'chime.caf', 
          },
        },
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        type: 'MESSAGE',
      },
      token,
    };
  
    const technicianMessaging = admin.app('technicianApp').messaging();
    const response = await technicianMessaging.send(message);
      console.log('Notification sent successfully:', response);
    });
}
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }