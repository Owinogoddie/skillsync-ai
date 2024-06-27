import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-100 opacity-75 flex flex-col items-center justify-center">
      <Loader2 className=" h-12 w-12 mb-4 animate-spin"/>
      <h2 className="text-center text-gray-500 text-xl font-semibold">
        Loading...
      </h2>
      <p className="w-1/3 text-center text-gray-400 ">
        This may take a few seconds, please wait 😢.
      </p>
    </div>
  );
}