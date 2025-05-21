"use client";
import React from "react";
import ArticleMatchingGame from "@/components/ArticleMatchingGame";
import HighlightSelectText from "@/components/HightLightSelectText";
import HighlightSpeakFollowSentence from "@/components/HightLightSpeakFollowSentence";
import LetterMatchingGame from "@/components/LetterMatchingGame";
import LetterMatchingGameMultiAnswer from "@/components/LetterMatchingGameMultiAnswer";
import FillLetterMatchingGame from "@/components/FillLetterMatchingGame";
import FillLetterMatchingGameMultiAnswer from "@/components/FillLetterMatchingGameMultiAnswer";

export default function Home() {
  return (
    <div
      className="min-h-screen p-8 pb-20 flex flex-col gap-16 sm:p-20"
      style={{
        background: "linear-gradient(to bottom, #1a237e, #000000)", // น้ำเงิน -> ดำ
      }}
    >
      <h1 className="text-4xl text-[#fff] font-bold text-center">
        Interactive Learning Games
      </h1>

      {/* Letter Matching Game */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🔤 Letter Matching Game</h2>
        <LetterMatchingGame />
      </section>

      {/* Letter Matching Game (Multi Answer) */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          🔤 Letter Matching Game (Multi Answer)
        </h2>
        <LetterMatchingGameMultiAnswer />
      </section>

      {/* Fill the correct letters */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          🔣 Fill the correct letters
        </h2>
        <FillLetterMatchingGame />
      </section>

      {/* Fill the correct letters (Multi Answer) */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          🔣 Fill the correct letters (Multi Answer)
        </h2>
        <FillLetterMatchingGameMultiAnswer />
      </section>

      {/* Article Matching Game */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          🔠 Article Matching Game
        </h2>
        <ArticleMatchingGame />
      </section>

      {/* Highlight Select Text */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📝 Highlight Select Text</h2>
        <HighlightSelectText />
      </section>

      {/* Highlight Speak Follow Sentence */}
      <section className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          🎤 Highlight Speak Follow Sentence ver 2
        </h2>
        <HighlightSpeakFollowSentence />
      </section>
    </div>
  );
}
