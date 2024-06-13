"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import Video from "next-video";
import ReactPlayer from 'react-player/lazy';

import { useconfettiStore } from "@/hooks/use-confetti";

interface VideoPlayerProps {
  playbackId: string;
  videoUrl?: string | null; // URL for the video, if any
  videoId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  isCompleted?: boolean;
}

export const VideoPlayer = ({
  playbackId,
  videoId,
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  isCompleted
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false); // State to track if the video has ended
  const router = useRouter();
  const confetti = useconfettiStore();

  useEffect(() => {
    console.log("Next Chapter ID:", nextChapterId);
  }, [nextChapterId]);

  const endVideo1 = async () => {
    try {
      confetti.onOpen();
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true }
        );

        toast.success("Progress updated");
        // router.refresh();
        setVideoEnded(true); // Set videoEnded to true when the video ends
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Something went wrong");
    }
  };

  const endVideo = async () => {
    try {
      // setIsLoading(true);

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      // setIsLoading(false);
    }
  }

  useEffect(() => {
    if (videoEnded && nextChapterId) {
      console.log("Next chapter available, navigating...");
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    } else if (videoEnded) {
      console.log("No next chapter ID available");
    }
  }, [videoEnded, nextChapterId, courseId, router]);

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const renderVideoPlayer = () => {
    if (videoId) {
      return (
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          title={title}
          controls
          onReady={() => setIsReady(true)}
          onEnded={endVideo}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }
    if (videoUrl && isYouTubeUrl(videoUrl)) {
      const videoIdFromUrl = new URLSearchParams(new URL(videoUrl).search).get("v");
      return (
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoIdFromUrl}`}
          title={title}
          controls
          onReady={() => setIsReady(true)}
          onEnded={endVideo}
        />
      );
    } else if (playbackId) {
      return (
        <Video
          src={`https://www.youtube.com/embed/${playbackId}`}
          title={title}
          onEnded={endVideo}
        />
      );
    } else if (videoUrl) {
      return (
        <Video
          src={videoUrl}
          controls
          onCanPlay={() => setIsReady(true)}
          onEnded={endVideo}
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Loader2 className="h-10 w-10 text-slate-500" />
        </div>
      );
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && renderVideoPlayer()}
    </div>
  );
};
