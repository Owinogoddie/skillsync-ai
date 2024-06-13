import {v4 as uuidv4} from "uuid"
import crypto from "crypto"
import { getVerificationTokenByEmail } from "./verification-token";
import prisma from "@/lib/db";
import { getPasswordResetTokenByEmail } from "./password-reset-token";
import { getTwoFactorTokenByEmail } from "./two-factor-token";

export const generateTwoFactorToken=async(email:string)=>{
    const token =crypto.randomInt(100_00,1_000_000).toString();

    // later change to 15 mins
    const expires= new Date(Date.now() + 3600 * 1000);

    const existingToken=await getTwoFactorTokenByEmail(email);
    if(existingToken){
        await prisma.twoFactorToken.delete({
            where:{id:existingToken.id               
            }
        })
    }
    const twoFactorToken=await prisma.twoFactorToken.create({
        data:{
            email,
            token,
            expires
        }
    })
    return twoFactorToken

}
export const generateVerificationToken=async(email:string)=>{
    const token =uuidv4();
    const expires= new Date(Date.now() + 3600 * 1000);

    const existingToken=await getVerificationTokenByEmail(email);
    if(existingToken){
        await prisma.verificationToken.delete({
            where:{id:existingToken.id               
            }
        })
    }
    const verificationToken=await prisma.verificationToken.create({
        data:{
            email,
            token,
            expires
        }
    })
    return token

}
export const generatePasswordResetToken=async(email:string)=>{
    const token =uuidv4();
    const expires= new Date(Date.now() + 3600 * 1000);

    const existingToken=await getPasswordResetTokenByEmail(email);
    if(existingToken){
        await prisma.passwordResetToken.delete({
            where:{id:existingToken.id               
            }
        })
    }
    const verificationToken=await prisma.passwordResetToken.create({
        data:{
            email,
            token,
            expires
        }
    })
    return token

}