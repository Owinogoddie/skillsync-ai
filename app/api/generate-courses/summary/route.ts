import db from "@/lib/db";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuestionsFromTranscript, getTranscript } from "@/lib/youtube";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chapterId } = body;

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter not found" },
        { status: 404 }
      );
    }

    if (!chapter.videoId) {
      return new NextResponse("Video not supported", { status: 500 });
    }

    let transcript = await getTranscript(chapter.videoId);
    if (!transcript) {
      return new NextResponse("Video not supported", { status: 500 });
    }

    if (transcript.split(" ").length > 1000) {
      transcript = transcript.split(" ").slice(0, 1000).join(" ");
    }

    const summaryPrompt = `
      You are a helpful AI capable of summarizing a YouTube transcript.
      Summarize the transcript in 250 words or less, focusing only on the main topic.
      Exclude any mentions of sponsors or unrelated content.
      Do not introduce what the summary is about.

      The output should be a summary in the following format:
      {
        "summary": "string"
      }
    `;

    const inputText = `Summarize the following transcript: "${transcript}"`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: summaryPrompt },
        { role: "user", content: inputText },
      ],
      model: "llama3-70b-8192",
    });

    const resp = response.choices[0]?.message?.content;

    if (!resp) {
      throw new Error("Received empty response from Groq API");
    }

    let summary;
    try {
      summary = JSON.parse(resp);
    } catch (jsonError) {
      console.error("Failed to parse JSON response from Groq API:", jsonError);
      throw new Error("Error parsing Groq API response");
    }

    const questions = await getQuestionsFromTranscript(transcript, chapter.title);

    if (!questions) {
      throw new Error("Failed to generate questions");
    }

    await db.question.createMany({
      data: questions.map((question: any) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await db.chapter.update({
      where: { id: chapterId },
      data: {
        isFree: true,
        summary: summary.summary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    const status = error instanceof z.ZodError ? 400 : 500;
    const message = error instanceof z.ZodError ? "Invalid body" : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: status }
    );
  }
}
