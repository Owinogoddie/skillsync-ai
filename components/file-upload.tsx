"use client"
import axios from "axios";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";


export const FileUpload: React.FC = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: "image/jpeg, image/png",
    onDrop: async (acceptedFiles) => {
    //   const response = await axios.post("/api/image-upload", {
    //     file: acceptedFiles[0],
    //   });
    //   console.log("RESPONSE", response.data);
    //   console.log(acceptedFiles[0].name)
    },
  });
  return (
    <div
      {...getRootProps()}
      className={`bg-slate-200/20 dropzone ${isDragActive ? "active" : ""}`}
      style={{ border: "2px dashed #ccc", padding: "20px", cursor: "pointer" }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag `&apos;`n`&apos;` drop some files here, or click to select files</p>
      )}
    </div>
  );
};
