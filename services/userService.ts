import nodemailer from "nodemailer";
import { PrismaClient, User } from "@prisma/client";
import "dotenv/config";
import jwt, { IPayload } from "../utils/jwt";
import bcrypt from "bcrypt";
const Emailgreeny = process.env.Emailgreeny || "";
const emailpassword = process.env.emailpassword || "  ";
const user = new PrismaClient().user;
export const sendEmail = async (
  subject: string,
  text: string,
  emailgiven: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Emailgreeny,
        pass: emailpassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: Emailgreeny,
      to: emailgiven,
      subject: subject,
      text: text,
    };

    const sendingState = await transporter.sendMail(mailOptions);

    if (sendingState.rejected.length != 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
};

export const generateRandomCode = () =>
  Math.random().toString().substring(2, 8);

export const isEmailExists = async (email: string) => {
  const checkuseremail = await user.findUnique({
    where: {
      email,
    },
  });
  return checkuseremail;
}

export const gettechnicians = async () => {
  try {


    
    const technicians = await user.findMany({
      where: { role: 'technician' },
   
    });

    return technicians;


  } catch (error) {
    throw error
  }
};
export const resetPassword = async (newPassword: string, userRecord: User) => {
  try {
    newPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await user.update({
      where: { id: userRecord.id },
      data: {
        password: newPassword,
        accesstoken: userRecord.accesstoken,
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
export const createtechnicianservice = async (userdata: any) => {
  try {
      userdata.password = await bcrypt.hash(userdata.password, 10);
      const createduser = await user.create({
          data: {
              username: userdata.firstname +"_"+ userdata.lastname,
              firstname: userdata.firstname,
              lastname: userdata.lastname,
              phonenumber: userdata.phonenumber,
              birthdate: userdata.birthdate,
              password: userdata.password,
              email: userdata.email,
              role : "technician"
          },
      });
     
     
      return createduser;
  }
  catch (error) {
      throw error;
  }
}
export const updatefcmtokenuserService = async (userid: number, fcmtoken: string) => {
  try {
    let userfound = await user.findFirst({
      where: { id: userid },
      select: { fcmToken: true } 
    });

    if (userfound) {
      const tokens = userfound.fcmToken || [];

      if (!tokens.includes(fcmtoken)) {
        tokens.push(fcmtoken);

        const userupdated = await user.update({
          where: { id: userid },
          data: {
            fcmToken: tokens
          }
        });

        return userupdated;
      } else {
        return { message: 'FCM token already exists for this user.' };
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};
export const getuserbyIdService = async (userid: number) => {
 
  const userfound = await user.findUnique({
    where: {
      id:userid,
    },
  });
  if(userfound){
  return userfound

  }
}
export const checkUserSubscription = async (userid: number) => {
 
  const checkuser = await user.findUnique({
    where: {
      id:userid,
    },
  });
  if(checkuser?.premium){
    const datenow = new Date();
    const paymentDate = new Date(checkuser.paymentdate!);

    const differenceInDays = (datenow.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);

    
    if (differenceInDays <= 30) {
   
      return true;
    } else {
     
      return false;
    }

  }else{
    return false;
  }
}
