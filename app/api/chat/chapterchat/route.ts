import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser, BytesOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { getTranscript } from "@/lib/youtube";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";


export const runtime = "edge";
const globalVectorStores: Record<string, MemoryVectorStore> = {};
const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  return chatHistory.map((message) => `${message.role}: ${message.content}`).join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(CONDENSE_QUESTION_TEMPLATE);

const ANSWER_TEMPLATE = `You are a helpful AI assistant. Answer the question based on the following context and chat history:
Context: {context}

Chat History: {chat_history}

Question: {question}

Answer:`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, chapterId, messages, videoId } = body;

    if (!userId || !videoId || !chapterId || !messages || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing userId, chapterId, or messages' }, { status: 400 });
    }

    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "embedding-001", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      });
   
    const storeKey = `${userId}:${chapterId}`;
    let vectorStore = globalVectorStores[storeKey];
    if (!vectorStore) {
        console.log(`Creating new vector store for user ${userId} and chapter ${chapterId}`);
        const transcriptText = await getTranscript(videoId);
        if (!transcriptText) {
          return NextResponse.json({ success: false, error: 'Failed to load chapter transcript' }, { status: 500 });
        }
        const docs = [new Document({ pageContent: transcriptText })];
        vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
        globalVectorStores[storeKey] = vectorStore;
      }

    // Initialize Groq model
    const model = new ChatGroq({
      temperature: 0.2,
    });
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);
    const retriever = vectorStore.asRetriever();
    const retrievalChain = retriever.pipe(combineDocumentsFn);
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });
    // console.log(stream)

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// async function loadChapterTranscript(videoId: string): Promise<Document<Record<string, any>>[] | undefined> {
//   try {
//     const transcript = await getTranscript(videoId);
//     if (!transcript) {
//       console.log("Error getting the transcript");
//       return undefined;
//     }
//     const loader = new TextLoader(transcript);
//     const docs = await loader.load();
//     return docs;
//   } catch (error) {
//     console.error("Error loading chapter transcript:", error);
//     return undefined;
//   }
// }
