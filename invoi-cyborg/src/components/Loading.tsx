"use client";
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <div className="w-6 h-6 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-6 h-6 bg-green-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
        <div className="w-6 h-6 bg-red-400 rounded-full animate-bounce delay-300"></div>
        <div className="w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  );
}
