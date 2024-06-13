import db from "@/lib/db";
import Groq from "groq-sdk";
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server";
import {cleaned} from './coursetest'
import { generateImageQuery } from "./generate-image-searchQuery";

export async function POST(req: Request) {
    const testcourse=cleaned
    const userId = await getUserId();
    const body = await req.json();
  // response_format": {"type": "json_object"}
  const responseFormat = { type: "json_object" };
  try {
    const {title,units}=body
    const system_prompt = `
You are a course creator who generates multiple course units in JSON format. 
You also provide the course unsplash image query, a  description about the course and a chapter's youtube search query.
The units and chapters should be provided in the order they should be learned.
Please do not provide any additional infomation after the geneated object.
The output should be a json object with unsplash_image_query ,course_description,course_name and course_units which shld be an array of units with each unit having unit_name and chapters. Each chapters should be an array of chapter_number,chapter_title,chapter_description,chapter_youtube_search_query. Please, adhere to the format.
The JSON schema should include:
{   
  "unsplash_image_query":"string",
  "course_description:"string",
  "course_name": "string",

  "course_units": [
    
        {
          "unit_name": "string",
          "chapters": [
            {
              "chapter_number": "integer",
              "chapter_title": "string",
              "chapter_description": "string",
              "chapter_youtube_search_query": "string"
            },
            {
              "chapter_number": "integer",
              "chapter_title": "string",
              "chapter_description": "string",
              "chapter_youtube_search_query": "string"
            },
          ]
        },
        {
          "unit_name": "string",
          "chapters": [
            {
              "chapter_number": "integer",
              "chapter_title": "string",
              "chapter_description": "string",
              "chapter_youtube_search_query": "string"
            },
            {
              "chapter_number": "integer",
              "chapter_title": "string",
              "chapter_description": "string",
              "chapter_youtube_search_query": "string"
            },
          ]
        },
  ]
}
`;

    const input_text =
      `Generate 3 course units with  3 chapters each for the course ${title}'.`;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: input_text },
      ],
      model: "llama3-70b-8192",
      //   mixtral-8x7b-32768 llama3-70b-8192 llama3-8b-8192
    });
    const resp = response.choices[0]?.message?.content;
    // const resp=cleaned
    const cleanedResponse = resp?.replace(/```(json)?/g, "");
    // const cleanedResponse = cleaned;
    // console.log('cleaned',cleanedResponse);
    if(!cleanedResponse){
        return new NextResponse("Something went wrong", { status: 200 });
    }
    let courseData;
    if (typeof cleanedResponse === 'string') {
        // Parse the JSON string into a JavaScript object
        try {
          courseData = JSON.parse(cleanedResponse);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          return;
        }
      } else {
        // If the response is already an object, use it directly
        courseData = cleanedResponse;
      }
      interface ChapterData {
        chapter_number: number;
        chapter_title: string;
        chapter_description: string;
        chapter_youtube_search_query: string;
      }
      
      interface UnitData {
        unit_name: string;
        chapters: ChapterData[];
      }
      
      interface CourseData {
        course_name: string;
        course_units: UnitData[];
      }
  const imageURL=await generateImageQuery(courseData.unsplash_image_query)
//   console.log('IMAGE_URL',imageURL)
      const course = await db.course.create({
        data:{
            title:courseData.course_name,
            userId,
            imageUrl:imageURL,
            description:courseData.course_description
        }
      })
    
for (let i = 0; i < courseData.course_units.length; i++) {
    const unit = courseData.course_units[i];
    const title = unit.unit_name;
    
    // Create unit
    const prismaUnit = await db.unit.create({
      data: {
        name: title,
        position: i + 1,
        courseId: course.id,
      },
    });
    
    // Create chapters for the unit
    for (let j = 0; j < unit.chapters.length; j++) {
      const chapter = unit.chapters[j];
      await db.chapter.create({
        data: {
          title: chapter.chapter_title,
          youtubeSearchQuery: chapter.chapter_youtube_search_query,
          unitId: prismaUnit.id,
          position: j + 1,
          courseId: course.id,
          description: chapter.chapter_description,
        },
      });
    }
  }
      console.log(course);

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.log("ERROR_GENERATING_CHAT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
