"use client";
import React from "react";
import ArticleMatchingGame from "@/components/ArticleMatchingGame";
import HighlightSelectText from "@/components/HightLightSelectText";
import HighlightSpeakFollowSentence from "@/components/HightLightSpeakFollowSentence";
import LetterMatchingGame from "@/components/LetterMatchingGame";

export default function Home() {
  return (
    <div
      className="min-h-screen p-8 pb-20 flex flex-col gap-16 sm:p-20"
      style={{
        background: "linear-gradient(to bottom, #1a237e, #000000)", // น้ำเงิน -> ดำ
      }}
    >
      <h1 className="text-4xl text-[#fff] font-bold text-center">Interactive Learning Games</h1>
        
      {/* Letter Matching Game */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🔤 Letter Matching Game</h2>
        <LetterMatchingGame />
      </section>

      {/* Article Matching Game */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🔠 Article Matching Game</h2>
        <ArticleMatchingGame />
      </section>

      {/* Highlight Select Text */}
      {/* <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📝 Highlight Select Text</h2>
        <HighlightSelectText />
      </section> */}

      {/* Highlight Speak Follow Sentence */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🎤 Highlight Speak Follow Sentence</h2>
        <HighlightSpeakFollowSentence />
      </section>

    </div>
  );
}
