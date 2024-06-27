import db from "@/lib/db";
import Groq from "groq-sdk";
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server";
import { generatePexelsImageUrl } from "./generate-pexels-imageurl";

// Define the structure of a unit
interface Unit {
  name?: string;
  chapterCount: number;
}

// Define the structure of the request body
interface RequestBody {
  title: string;
  units: Unit[];
}

export async function POST(req: Request) {
  const userId = await getUserId();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body: RequestBody = await req.json();
  const { title, units } = body;

  const system_prompt = `
    You are a course creator who generates multiple course units in JSON format. 
    You also provide the course unsplash image query, a description about the course, and a chapter's YouTube search query.
    The units and chapters should be provided in the order they should be learned.
    Please do not provide any additional information after the generated object.
    The output should be a JSON object with unsplash_image_query, course_description, course_name, and course_units which should be an array of units with each unit having unit_name and chapters. Each chapter should be an array of chapter_number, chapter_title, chapter_description, chapter_youtube_search_query. Please, adhere to the format.
    The JSON schema should include:
    {   
      "unsplash_image_query": "string",
      "course_description": "string",
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
            }
          ]
        }
      ]
    }
  `;

  const input_text = `Generate a course with the title "${title}" and the following units:
    ${units.map((unit: Unit, index: number) => `
      Unit ${index + 1}: ${unit.name ? unit.name : '[Generate an appropriate name for this unit]'}
      Number of chapters: ${unit.chapterCount}
    `).join('\n')}
    For any unit without a name, please generate an appropriate and descriptive name based on the course title and the unit's position in the course.
    Ensure that each unit has the specified number of chapters.`;

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: input_text },
      ],
      model: "llama3-70b-8192",
    });

    const resp = response.choices[0]?.message?.content;
    const cleanedResponse = resp?.replace(/```(json)?/g, "");

    if (!cleanedResponse) {
      return new NextResponse("Something went wrong", { status: 200 });
    }

    let courseData;
    if (typeof cleanedResponse === 'string') {
      try {
        courseData = JSON.parse(cleanedResponse);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return new NextResponse("Internal server error", { status: 500 });
      }
    } else {
      courseData = cleanedResponse;
    }

    const imageURL = await generatePexelsImageUrl(courseData.unsplash_image_query);

    const course = await db.course.create({
      data: {
        title: courseData.course_name,
        userId: userId,
        imageUrl: imageURL,
        description: courseData.course_description,
      },
    });

    for (let i = 0; i < courseData.course_units.length; i++) {
      const unit = courseData.course_units[i];
      const title = unit.unit_name;

      const prismaUnit = await db.unit.create({
        data: {
          name: title,
          position: i + 1,
          courseId: course.id,
        },
      });

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
    console.log(course)

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.log("ERROR_GENERATING_CHAT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}