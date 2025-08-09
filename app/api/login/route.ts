import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const {email, password} = body;
        const user = await prisma?.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            return NextResponse.json({message:"Invalid Email !"},{status:400});
        }
        const isMatch = await bcrypt.compare(password,user.hashedPassword);
        if(!isMatch){
            return NextResponse.json({message:"Incorrect password or email"},{status:400});
        }
        const payload = {
            id:user.id
        };
        const token = await signToken(payload);
        const {hashedPassword,...userWithoutPassword} = user;
        return NextResponse.json({message:"Login successful !",token,user:userWithoutPassword},{status:201});
    }catch(err){
        console.log("Error from login route: ",err);
        return NextResponse.json({message:"Error while logging in !"},{status:500});
    }
}
function signToken(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '8h' }, (err, token) => {
            if (err || !token) {
                return reject(err || new Error("Failed to sign token"));
            }
            resolve(token);
        });
    });
}