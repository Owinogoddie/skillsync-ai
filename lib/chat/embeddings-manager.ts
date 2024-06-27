// import fs from 'fs';
// import path from 'path';

// const MAX_CHAPTERS_PER_USER = 5;
// const EMBEDDING_EXPIRY_DAYS = 30;

// export async function manageEmbeddings(userId: string, currentChapterId: string): Promise<boolean> {
//   const userDir = path.join(process.cwd(), 'data', userId);

//   // Ensure user directory exists
//   if (!fs.existsSync(userDir)) {
//     fs.mkdirSync(userDir, { recursive: true });
//   }

//   const currentChapterPath = path.join(userDir, currentChapterId);
  
//   // If the embeddings for this chapter already exist, just update the access time and return
//   if (fs.existsSync(currentChapterPath)) {
//     fs.utimesSync(currentChapterPath, new Date(), new Date());
//     return false; // Indicates no new embeddings need to be created
//   }

//   // Get all chapter directories for this user
//   const chapterDirs = fs.readdirSync(userDir).filter(dir => 
//     fs.statSync(path.join(userDir, dir)).isDirectory()
//   );

//   // Remove expired embeddings and count non-expired ones
//   const now = new Date();
//   let nonExpiredCount = 0;
//   for (const dir of chapterDirs) {
//     const chapterPath = path.join(userDir, dir);
//     const stats = fs.statSync(chapterPath);
//     const daysSinceAccess = (now.getTime() - stats.mtime.getTime()) / (1000 * 3600 * 24);

//     if (daysSinceAccess > EMBEDDING_EXPIRY_DAYS) {
//       fs.rmSync(chapterPath, { recursive: true, force: true });
//     } else {
//       nonExpiredCount++;
//     }
//   }

//   // If we're at or over the limit after removing expired ones, remove the oldest non-expired chapter
//   if (nonExpiredCount >= MAX_CHAPTERS_PER_USER) {
//     const oldestChapter = chapterDirs
//       .map(dir => ({ dir, mtime: fs.statSync(path.join(userDir, dir)).mtime }))
//       .filter(({ dir }) => dir !== currentChapterId) // Exclude the current chapter
//       .sort((a, b) => a.mtime.getTime() - b.mtime.getTime())[0];

//     if (oldestChapter) {
//       fs.rmSync(path.join(userDir, oldestChapter.dir), { recursive: true, force: true });
//     }
//   }

//   return true; // Indicates new embeddings should be created
// }
