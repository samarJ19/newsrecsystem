import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "./api/db"
import { JWTPayload } from "@/types";
module.exports = ()=>{
    return async (req:NextRequest) => {
        try{
            const token = req.headers.get('Authorization')?.replace('Bearer ', '');
            if(!token){
                return NextResponse.json({message:"No token, authroization denied"},{status:401});
            }
            const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JWTPayload;
            //Not taking user interaction !
            const user = await prisma.user.findUnique({
                where:{
                    id:decoded.id
                }
            });
            if(!user){
                return NextResponse.json({message:"User not Found"},{status:404});
            }
            const {hashedPassword, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;
            NextResponse.next();
        }catch(err){
            console.log("Error in the middleware");
            NextResponse.json({message:"Token not set or valid"},{status:401});

        }
    }
}
export const config = {
  matcher: [
    '/user/:path*',
  ]
};