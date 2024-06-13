import db from "@/lib/db";
import Groq from "groq-sdk";

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery!);
    // let transcript = await getTranscript(videoId);
    // let maxLength = 500;
    // transcript = transcript!.split(" ").slice(0, maxLength).join(" ");

    // const summaryPrompt = `
    // You are a helpful AI capable of summarizing a YouTube transcript. 
    // Summarize the transcript in 250 words or less, focusing only on the main topic. 
    // Exclude any mentions of sponsors or unrelated content. 
    // Do not introduce what the summary is about.

    // The output should be a summary in the following format:
    // {
    //   "summary": "string"
    // }
    // `;

    // const inputText = `Summarize the following transcript:"${transcript}"`;

    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // const response = await groq.chat.completions.create({
    //   messages: [
    //     { role: "system", content: summaryPrompt },
    //     { role: "user", content: inputText },
    //   ],
    //   model: "llama3-70b-8192",
    // });

    // const resp = response.choices[0]?.message?.content;
    
    // // Additional error handling for JSON parsing
    // if (!resp) {
    //   throw new Error("Received empty response from Groq API");
    // }

    // let summary;
    // try {
    //   summary = JSON.parse(resp);
    // } catch (jsonError) {
    //   console.error("Failed to parse JSON response from Groq API:", jsonError);
    //   console.error("Groq API response:", resp);
    //   throw jsonError;
    // }

    // const questions = await getQuestionsFromTranscript(
    //   transcript,
    //   chapter.title
    // );

    // if (!questions) {
    //   throw new Error("Failed to generate questions");
    // }

    // await db.question.createMany({
    //   data: questions.map((question: any) => {
    //     let options = [
    //       question.answer,
    //       question.option1,
    //       question.option2,
    //       question.option3,
    //     ];
    //     options = options.sort(() => Math.random() - 0.5);
    //     return {
    //       question: question.question,
    //       answer: question.answer,
    //       options: JSON.stringify(options),
    //       chapterId: chapterId,
    //     };
    //   }),
    // });

    await db.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        isFree:true
        // summary: summary.summary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "unknown",
        },
        { status: 500 }
      );
    }
  }
}
