"use client";
import React, { useState, useEffect } from "react";

const HightLightSelectText: React.FC = () => {
  const [text, setText] = useState<string>(
    "This is an example text. Click any word to highlight and speak it. Or click the button to speak the full sentence."
  );
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    setWords(text.split(" ")); // แยกข้อความเป็นคำ ๆ
  }, [text]);

  const detectLanguage = (text: string): string => {
    const langMap: { regex: RegExp; lang: string }[] = [
      { regex: /[\u0E00-\u0E7F]/, lang: "th-TH" }, // ไทย
      { regex: /[\u3040-\u30FF\u31F0-\u31FF]/, lang: "ja-JP" }, // ญี่ปุ่น
      { regex: /[\uAC00-\uD7AF]/, lang: "ko-KR" }, // เกาหลี
      { regex: /[\u0400-\u04FF]/, lang: "ru-RU" }, // รัสเซีย
      { regex: /[\u0370-\u03FF]/, lang: "el-GR" }, // กรีก
      { regex: /[\u0590-\u05FF]/, lang: "he-IL" }, // ฮิบรู
      { regex: /[\u0600-\u06FF]/, lang: "ar-SA" }, // อาหรับ
      { regex: /[\u0900-\u097F]/, lang: "hi-IN" }, // ฮินดี
      { regex: /[\u4E00-\u9FFF]/, lang: "zh-CN" }, // จีน (แมนดาริน)
      { regex: /[äöüß]/i, lang: "de-DE" }, // เยอรมัน
      { regex: /^[A-Za-z0-9\s.,!?'"-]+$/, lang: "en-US" }, // อังกฤษ
    ];

    for (const { regex, lang } of langMap) {
      if (regex.test(text)) {
        return lang;
      }
    }
    return navigator.language || "en-US"; // ถ้าไม่รู้ภาษา ให้ใช้ค่าจาก Browser
  };

  const speakWord = (word: string, index: number) => {
    if (!word.trim()) return;

    setCurrentWordIndex(index); // Highlight คำที่ถูกเลือก
    const synth = window.speechSynthesis;
    const lang = detectLanguage(word);
    const utterance = new SpeechSynthesisUtterance(word);

    utterance.lang = lang;
    utterance.rate = 1;

    // เลือกเสียงที่ตรงกับภาษา
    const voices = synth.getVoices().filter((voice) => voice.lang.startsWith(lang.substring(0, 2)));
    if (voices.length > 0) utterance.voice = voices[0];

    utterance.onend = () => {
      setTimeout(() => setCurrentWordIndex(null), 500); // ลบ Highlight หลังจากพูดจบ
    };

    synth.speak(utterance);
  };

  const speakSentence = () => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    const synth = window.speechSynthesis;
    const lang = detectLanguage(text);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;
    utterance.rate = 1;

    const voices = synth.getVoices().filter((voice) => voice.lang.startsWith(lang.substring(0, 2)));
    if (voices.length > 0) utterance.voice = voices[0];

    // คำนวณตำแหน่งคำเพื่อทำ Highlight ขณะที่อ่าน
    const wordTimings: number[] = [];
    let charIndex = 0;
    words.forEach((word) => {
      wordTimings.push(charIndex);
      charIndex += word.length + 1; // +1 สำหรับช่องว่าง
    });

    utterance.onboundary = (event) => {
      const wordIndex = wordTimings.findIndex((t) => t >= event.charIndex);
      setCurrentWordIndex(wordIndex);
    };

    utterance.onend = () => {
      setCurrentWordIndex(null);
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h3>📝 พิมพ์ข้อความ คลิกคำเพื่อให้พูด หรือกดปุ่มให้พูดทั้งประโยค</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
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

      <h3>🔊 คลิกคำใดก็ได้เพื่อให้พูด</h3>
      <div
        style={{
          whiteSpace: "pre-wrap",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            onClick={() => speakWord(word, index)}
            style={{
              backgroundColor: index === currentWordIndex ? "yellow" : "transparent",
              cursor: "pointer",
              padding: "2px",
              margin: "2px",
            }}
          >
            {word}{" "}
          </span>
        ))}
      </div>

      <button
        onClick={speakSentence}
        disabled={isSpeaking}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: isSpeaking ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isSpeaking ? "not-allowed" : "pointer",
        }}
      >
        🔊 {isSpeaking ? "กำลังพูด..." : "Speak Full Sentence"}
      </button>
    </div>
  );
};

export default HightLightSelectText;
