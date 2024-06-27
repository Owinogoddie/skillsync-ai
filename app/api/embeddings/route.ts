// // app/api/embeddings/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
// import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
// import { manageEmbeddings } from '@/lib/chat/embeddings-manager';

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, chapterId } = await req.json();

//     if (!userId || !chapterId) {
//       return NextResponse.json({ success: false, error: 'Missing userId or chapterId' }, { status: 400 });
//     }

//     const shouldCreateNewEmbeddings = await manageEmbeddings(userId, chapterId);

//     if (shouldCreateNewEmbeddings) {
//       const embeddings = new HuggingFaceTransformersEmbeddings({
//         model: "Xenova/all-MiniLM-L6-v2",
//       });

//       console.log(`Creating new vector store for user ${userId} and chapter ${chapterId}`);
//       const texts = await loadChapterTranscript(chapterId);
//       const vectorStore = await HNSWLib.fromTexts(texts, [], embeddings);
//       await vectorStore.save(`./data/${userId}/${chapterId}`);

//       return NextResponse.json({ success: true, message: 'New embeddings created successfully' }, { status: 200 });
//     } else {
//       return NextResponse.json({ success: true, message: 'Existing embeddings accessed' }, { status: 200 });
//     }
//   } catch (error) {
//     console.error('Error handling embeddings:', error);
//     return NextResponse.json({ success: false, error: 'Failed to process embeddings' }, { status: 500 });
//   }
// }

// async function loadChapterTranscript(chapterId: string): Promise<string[]> {
//   // Implementation to load chapter transcript
//   // This is a placeholder
//   return [`Transcript for chapter ${chapterId}`];
// }