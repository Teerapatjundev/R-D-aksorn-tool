"use client";
import React, { useState } from "react";

const HighlightSpeakFollowSentence: React.FC = () => {
  const [text, setText] = useState<string>(
    "This is an example text. You can highlight parts of this text."
  );
  const [highlightedRanges, setHighlightedRanges] = useState<
    { start: number; end: number }[]
  >([]);

  const handleSelection = () => {
    const textarea = document.getElementById(
      "highlightTextarea"
    ) as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    if (selectionStart === selectionEnd) return;

    setHighlightedRanges((prevRanges) =>
      mergeHighlightRanges(prevRanges, selectionStart, selectionEnd)
    );
  };

  const mergeHighlightRanges = (
    ranges: { start: number; end: number }[],
    start: number,
    end: number
  ) => {
    const newRanges: { start: number; end: number }[] = [];

    for (const range of ranges) {
      if (start >= range.start && end <= range.end) return ranges;
      else if (range.start >= start && range.end <= end) continue;
      else if (start <= range.end && end >= range.start) {
        start = Math.min(start, range.start);
        end = Math.max(end, range.end);
      } else {
        newRanges.push(range);
      }
    }

    newRanges.push({ start, end });
    return newRanges.sort((a, b) => a.start - b.start);
  };

  const detectLanguage = (text: string): string => {
    const langMap: { regex: RegExp; lang: string }[] = [
      { regex: /[\u0E00-\u0E7F]/, lang: "th-TH" },
      { regex: /[\u3040-\u30FF\u31F0-\u31FF]/, lang: "ja-JP" },
      { regex: /[\uAC00-\uD7AF]/, lang: "ko-KR" },
      { regex: /[\u0400-\u04FF]/, lang: "ru-RU" },
      { regex: /[\u0370-\u03FF]/, lang: "el-GR" },
      { regex: /[\u0590-\u05FF]/, lang: "he-IL" },
      { regex: /[\u0600-\u06FF]/, lang: "ar-SA" },
      { regex: /[\u0900-\u097F]/, lang: "hi-IN" },
      { regex: /[\u4E00-\u9FFF]/, lang: "zh-CN" },
      { regex: /[äöüß]/i, lang: "de-DE" },
      { regex: /^[A-Za-z0-9\s.,!?'"-]+$/, lang: "en-US" },
    ];

    for (const { regex, lang } of langMap) {
      if (regex.test(text)) return lang;
    }

    return navigator.language || "en-US";
  };

  const speakContent = (textToSpeak: string) => {
    if (!textToSpeak) return;

    const lang = detectLanguage(textToSpeak);
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;

    const getBestVoice = (voices: SpeechSynthesisVoice[], lang: string) => {
      return (
        voices.find(
          (voice) => voice.lang === lang && voice.name.includes("Google")
        ) ||
        voices.find((voice) => voice.lang === lang) ||
        voices.find((voice) => voice.lang.startsWith(lang.split("-")[0])) ||
        voices[0]
      );
    };

    const speakWithVoices = () => {
      const voices = synth.getVoices();
      const bestVoice = getBestVoice(voices, lang);
      if (bestVoice) utterance.voice = bestVoice;
      synth.speak(utterance);
    };

    // Safari fallback: use timeout if voices not yet available
    if (synth.getVoices().length === 0) {
      // Try both onvoiceschanged AND timeout fallback
      let tried = false;

      const tryOnce = () => {
        if (tried) return;
        tried = true;
        speakWithVoices();
      };

      synth.onvoiceschanged = tryOnce;
      setTimeout(tryOnce, 300);
    } else {
      speakWithVoices();
    }
  };

  const speakText = () => {
    if (highlightedRanges.length === 0) return;
    const textToSpeak = highlightedRanges
      .map((range) => text.slice(range.start, range.end))
      .join(" ");
    speakContent(textToSpeak);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (newText.trim() === "") setHighlightedRanges([]);
  };

  const renderHighlightedText = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedRanges.forEach((range, idx) => {
      if (lastIndex < range.start) {
        parts.push(
          <span key={`normal-${idx}`}>
            {text.slice(lastIndex, range.start)}
          </span>
        );
      }

      const word = text.slice(range.start, range.end);

      parts.push(
        <span
          key={`highlight-${idx}`}
          onClick={() => speakContent(word)}
          style={{
            backgroundColor: "yellow",
            cursor: "pointer",
            padding: "2px",
            borderRadius: "3px",
          }}
        >
          {word} 🔊
        </span>
      );
      lastIndex = range.end;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="end">{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h3>📝 พิมพ์ข้อความและ Highlight เพื่อพูด</h3>

      <textarea
        id="highlightTextarea"
        value={text}
        onChange={handleTextChange}
        onMouseUp={handleSelection}
        rows={5}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
        }}
      />

      <h4>📌 ข้อความที่ถูก Highlight</h4>
      <div
        style={{
          whiteSpace: "pre-wrap",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
          minHeight: "100px",
        }}
      >
        {renderHighlightedText()}
      </div>

      {highlightedRanges.length > 0 && (
        <button
          onClick={speakText}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔊 พูดทุกคำที่ไฮไลต์
        </button>
      )}
    </div>
  );
};

export default HighlightSpeakFollowSentence;
