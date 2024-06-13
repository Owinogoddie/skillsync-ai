import { NextResponse } from "next/server";
import db from '@/lib/db';
import { getUserId } from '@/lib/get-userId';

export async function PATCH(req: Request) {
    try {
      const userId = await getUserId();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const { content ,chapterId} = await req.json();
      if (!content || typeof content !== 'string') {
        return new NextResponse("Invalid content", { status: 400 });
      }
  
      const note = await db.note.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId
          },
        },
        update: {
          content,
          isDefault: false,
        },
        create: {
          content,
          userId,
          chapterId:chapterId,
          isDefault: false,
        },
      });
  
      return NextResponse.json(note, { status: 200 });
    } catch (error) {
      console.log("[NOTE_PATCH]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }