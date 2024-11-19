import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt';
import jwt from '../utils/jwt';
import { generateRandomCode, sendEmail } from './userService';

const User = new PrismaClient().user;


export const createaccountservice = async (userdata: any) => {
    try {
        userdata.password = await bcrypt.hash(userdata.password, 10);
        const createduser = await User.create({
            data: {
                username: userdata.username,
                firstname: userdata.firstname,
                lastname: userdata.lastname,
                phonenumber: userdata.phonenumber,
                birthdate: userdata.birthdate,
                password: userdata.password,
                email: userdata.email,
                fcmToken : [userdata.fcmtokenuser]
            },
        });
        let token = jwt.sign(
            { id: createduser?.id, type: "authorization" },
        );
        const userwithtoken = await User.update({
            where: {
                id: createduser.id
            },
            data: {
                accesstoken: [token]
            }
        })
        return token;
    }
    catch (error) {
        throw error;
    }
}

export const forgetPasswordService = async (userData: User) => {
    let resetCode = generateRandomCode();
    const isEmailSent = await sendEmail("Account Recovery", `your verification code for recovery is :  ${resetCode}`, userData.email);
    if (isEmailSent) {
        userData.resetcode = Number(resetCode);
        userData.resetcodecreatedAt = new Date(Date.now());
        const userupdated = await User.update({
            where: {
                id: userData.id
            },
            data: {
                resetcode: userData.resetcode,
                resetcodecreatedAt: userData.resetcodecreatedAt,
            }
        })
        return userupdated;
    }
    else {
        return false;
    }
}
export const validateCode = async (code: number) => {
    let userfound = await User.findFirst({ where: { resetcode: code } })

    if (userfound) {

        let token = jwt.sign(
            { id: userfound?.id, type: "reset_password" }
        );
        userfound.accesstoken.push(token);
        const userupdated = await User.updateMany({
            where: {
                resetcode: code
            },
            data: {
                resetcode: null,
                resetcodecreatedAt: null,
                accesstoken: userfound.accesstoken,
            }
        });

        return token;
    }
    else {
        return null;
    }
}

export const loginService = async (passwordrequest: string, userFound: User) => {
    try {
        const value = await bcrypt.compare(passwordrequest, userFound.password);
        if (!value) {
            return null;
        }
        else {
            const token = jwt.sign({ id: userFound.id, type: "authorization" })
            userFound.accesstoken.push(token)
            const userupdated = await User.update({
                where: {
                    id: userFound.id
                },
                data: {
                    accesstoken: userFound.accesstoken
                }
            })
            return token;
        }
    }
    catch (error) {
        throw error;
    }
}

