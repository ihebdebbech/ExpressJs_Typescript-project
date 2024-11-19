import nodemailer from 'nodemailer';
import { PrismaClient, Task, User } from '@prisma/client'
import 'dotenv/config';
import jwt, { IPayload } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { createNotificationService } from './notificationService';
import  { sendPushNotificationTechnician } from '../middleware/notification';
import { sendEmail } from './userService';
const Emailgreeny = process.env.Emailgreeny || '';
const emailpassword = process.env.emailpassword || '  ';
const task = new PrismaClient().task;
const user = new PrismaClient().user;

export const getAlltasks = async () => {
  try {
    const tasks = await task.findMany({
      include: {
        technician: {
          select: {
            username: true,
            phonenumber: true,
          },
        },
      },
    });

    return tasks;
  } catch (error) {
    throw error;
  }
};

export const gettasksbytechinicanId = async (technicianId : number) => {
  try {


    
    const tasks = await task.findMany({
      include:{
        user: true, },
      where: { technicianId: technicianId },
   
    });

    return tasks;


  } catch (error) {
    throw error
  }
};

export const createTaskservice = async (taskdata: Task) => {
  const technician = await user.findUnique({
    where: {
      id: taskdata.technicianId,
    },
  });
    try {
        
        const createdtask = await task.create({
            data: taskdata,
        });
        const isEmailSent = await sendEmail("Your Order is Being Processed", `We are pleased to inform you that your order  is currently being processed. our technicians ${technician?.firstname}   ${technician?.lastname} will contact you within the next two days to assist with the next steps.

          If you have any questions or need further information, please don't hesitate to get in touch with us.
          
          Thank you for your patience and for choosing [Your Company Name].`, taskdata.userEmail);
          
        const notif = {
          userId: createdtask.technicianId,
          title: "New Task 📋",
          body : "new "+createdtask.taskType +" Task affected to you , consult the app for more detail ",
    
          type: "task",
          
        };
        const notifcreated = await createNotificationService(notif)
        const notif2 = await sendPushNotificationTechnician(notif.title,notif.body,notif.userId);
        return createdtask;
    }
    catch (error) {
        throw error;
    }
  }
  export const updateTaskService = async (taskId : number,report : string) => {
    try {

      const tasks = await task.update({
     
        where: { id: taskId },
     data : {report: report,status : "completed"},
      });
  
      return tasks;
  
  
    } catch (error) {
      throw error
    }
  };
