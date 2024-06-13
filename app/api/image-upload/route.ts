import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
const pump = promisify(pipeline);

export async function POST(req:NextRequest){
    try {
        const {file}=await req.json()
        console.log(file)
        const filePath = `./public/file/${file.name}`;
        await pump(file.stream, fs.createWriteStream(filePath));
        return NextResponse.json({status:"success",data:file.size})
        
        
    } catch (error) {
        console.log("ERROR_UPLOADING_IMAGE",error);
        return new NextResponse("Internal server error",{status:500})

        
    }
}