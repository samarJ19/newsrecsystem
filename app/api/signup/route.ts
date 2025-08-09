import { prisma } from "../db";
import bcrypt from "bcrypt";
//route for signup 

import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
       const body = await req.json();
       const {firstName, lastName, email,password }:{
        firstName:string,lastName:string,email:string,password:string
       } = body;
       let user = await prisma.user.findUnique({
        where:{
            email
        }
       });
       if(user){
        return NextResponse.json({message:"User already with same email"});
       }
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
       user = await prisma.user.create({
        data:{
            firstName,
            lastName,
            email,
            hashedPassword
        }
       });
       const {hashedPassword:_, ...userWithoutPassword} = user;
       return NextResponse.json({userWithoutPassword},{status:201});
    }catch(err){
        console.log("Error in sign up route due to: ",err);
        return NextResponse.json({message:"Singup Failed",err});
    }
}