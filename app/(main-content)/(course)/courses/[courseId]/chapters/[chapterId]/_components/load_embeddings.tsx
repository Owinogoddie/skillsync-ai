// 'use client'
// import React, { useEffect } from 'react'

// export const LoadEmbeddings = ({userId,chapterId}:{userId:string,chapterId:string}) => {
//     useEffect(() => {
//         const loadEmbeddings = async () => {
//           try {
//             // Make an API call to your server to load or create embeddings
//             const response = await fetch("/api/embeddings", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ userId, chapterId }),
//             });
    
//             if (!response.ok) throw new Error("Failed to load embeddings");
    
//             const data = await response.json();
//             console.log(data)
//           } catch (error) {
//             console.error("Error loading embeddings:", error);
//           }
//         };
    
//         loadEmbeddings();
    
//         // Cleanup function
//         // return () => {
//         //   // Optionally, you could make an API call here to clean up old embeddings
//         //   // But be cautious about doing this on every unmount
//         // };
//       }, [userId, chapterId]);
//   return (
//     <div></div>
//   )
// }
