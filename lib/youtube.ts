import axios from "axios";
import { YoutubeTranscript, YoutubeTranscriptError } from "youtube-transcript";
import Groq from "groq-sdk";
import youtube from "youtube-search-scraper";

// import { YoutubeTranscript } from "youtube-transcript";

export async function searchYoutube(searchQuery:string) {
  try {
    // eslint-disable-next-line
    const yt = new youtube.Scraper()
    const results = await yt.search(searchQuery);

    if (!results || !results.videos || results.videos.length === 0) {
      console.log("youtube-search-scraper returned no results");
      return null;
    }

    const videoId = results.videos[0].id;
    // console.log("VideoId", videoId);

    return videoId;
  } catch (error) {
    console.error("Failed to search YouTube:", error);
    return null;
  }
}

export async function getTranscript(videoId: string) {
  try {
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });

    if (!transcriptArr || transcriptArr.length === 0) {
      return "No transcript available for this video"; // Return a specific message if no transcript is available
    }

    const transcript = transcriptArr
      .map((t) => t.text)
      .join(" ")
      .replaceAll("\n", "");

    return transcript;
  } catch (error: any) {
    if (error instanceof YoutubeTranscriptError) {
      return "No transcript available for this video";
    } else {
      console.error("Failed to fetch transcript:", error);
      return null;
    }
  }
}

export async function getQuestionsFromTranscript(
  transcript: string,
  courseTitle: string
) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };

  const questionsPrompt = `
  You are a helpful AI capable of generating multiple-choice questions (MCQs) with concise answers. 
  Each answer should be no more than 15 words in length. 
  Please do not provide any additional infomation after the geneated object.
The output should be strictly an array of  questions, with each having a question,answer,option1,option2,option3 without any aditional information
Please, adhere to the format.
do not provide any additionals e.g 'Groq API response: Here are 5 hard MCQ questions related to the course "Functions and Modules" based on the provided transcript:'

  The output should be an array of questions in the following format:
  [
    {
      "question": "string",
      "answer": "string (max 15 words)",
      "option1": "string (max 15 words)",
      "option2": "string (max 15 words)",
      "option3": "string (max 15 words)"
    }
    {
      "question": "string",
      "answer": "string (max 15 words)",
      "option1": "string (max 15 words)",
      "option2": "string (max 15 words)",
      "option3": "string (max 15 words)"
    }
  ]
  `;

  const inputText = `
  - Generate 5 random hard MCQ question related to the course titled "${courseTitle}".
  - Base the question on the context provided in the following transcript: "${transcript}".
  `;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: questionsPrompt },
        { role: "user", content: inputText },
      ],
      model: "llama3-70b-8192",
    });

    const resp = response.choices[0]?.message?.content;

    // Additional error handling for JSON parsing
    if (!resp) {
      throw new Error("Received empty response from Groq API");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(resp);
    } catch (jsonError) {
      console.error("Failed to parse JSON response from Groq API:", jsonError);
      console.error("Groq API response:", resp);
      throw jsonError;
    }
    // const questionsArray = parsedResponse[1]
    console.log("Questions", parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return null;
  }
}
