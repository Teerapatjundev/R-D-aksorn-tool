"use client";
import React, { useState } from "react";

const HightLightSpeakFollowSentence: React.FC = () => {
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

    if (selectionStart === selectionEnd) return; // ไม่มีข้อความถูกเลือก

    setHighlightedRanges((prevRanges) =>
      mergeHighlightRanges(prevRanges, selectionStart, selectionEnd)
    );
  };

  // ฟังก์ชันรวม Highlight และตรวจสอบว่ามีอยู่แล้วหรือไม่
  const mergeHighlightRanges = (
    ranges: { start: number; end: number }[],
    start: number,
    end: number
  ) => {
    const newRanges: { start: number; end: number }[] = [];

    for (const range of ranges) {
      if (start >= range.start && end <= range.end) {
        // ✅ ถ้าช่วงใหม่ถูกครอบคลุมโดยช่วงเดิมอยู่แล้ว → ไม่ต้องเพิ่ม
        return ranges;
      } else if (range.start >= start && range.end <= end) {
      } else if (start <= range.end && end >= range.start) {
        // ✅ ถ้ามีการทับซ้อนกัน → รวมเป็นช่วงเดียวกัน
        start = Math.min(start, range.start);
        end = Math.max(end, range.end);
      } else {
        // ✅ ถ้าไม่มีทับซ้อนกัน → เก็บช่วงเก่าไว้
        newRanges.push(range);
      }
    }

    newRanges.push({ start, end }); // เพิ่ม Highlight ใหม่ที่รวมกันแล้ว
    return newRanges.sort((a, b) => a.start - b.start); // จัดเรียงตามลำดับ
  };

  const removeHighlight = (index: number) => {
    setHighlightedRanges((prev) => prev.filter((_, i) => i !== index));
  };

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
      { regex: /[äöüß]/i, lang: "de-DE" }, // เยอรมัน (ใช้ ä, ö, ü, ß)
      { regex: /^[A-Za-z0-9\s.,!?'"-]+$/, lang: "en-US" }, // อังกฤษ
    ];
  
    for (const { regex, lang } of langMap) {
      if (regex.test(text)) {
        return lang;
      }
    }
  
    // ถ้าไม่พบภาษา ให้ใช้ค่าภาษาของ Browser
    return navigator.language || "en-US";
  };

  const speakText = () => {
    if (highlightedRanges.length === 0) return;
  
    // รวมข้อความที่ถูก Highlight
    const textToSpeak = highlightedRanges.map(range => text.slice(range.start, range.end)).join(" ");
    if (!textToSpeak) return;
  
    // ตรวจจับภาษาของข้อความ
    const lang = detectLanguage(textToSpeak);
  
    // ใช้ SpeechSynthesis API
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
  
    // ฟังก์ชันเลือกเสียงที่ดีที่สุดสำหรับภาษา
    const getBestVoice = (voices: SpeechSynthesisVoice[], lang: string) => {
      return (
        voices.find(voice => voice.lang === lang && voice.name.includes("Google")) || // เลือกเสียง Google
        voices.find(voice => voice.lang === lang) || // เลือกเสียงแรกที่ตรงกับภาษา
        voices.find(voice => voice.lang.startsWith(lang.split("-")[0])) || // เลือกเสียงที่มีรหัสภาษาเดียวกัน (เช่น en-GB, en-US)
        voices[0] // ถ้าไม่มีเลย ใช้เสียงแรกที่มี
      );
    };
  
    // โหลดเสียงและเลือกเสียงที่ดีที่สุด
    const loadVoicesAndSpeak = () => {
      const voices = synth.getVoices();
      const bestVoice = getBestVoice(voices, lang);
      if (bestVoice) utterance.voice = bestVoice;
      synth.speak(utterance);
    };
  
    // ถ้า voices ยังไม่โหลด → รอให้โหลดก่อนแล้วพูด
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = loadVoicesAndSpeak;
    } else {
      loadVoicesAndSpeak();
    }
  };

  // ล้าง Highlight เมื่อข้อความถูกลบหมด
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHighlightedRanges([]);
    const newText = e.target.value;
    setText(newText);
    if (newText.trim() === "") {
      setHighlightedRanges([]); // เคลียร์ Highlight เมื่อไม่มีข้อความ
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h3>📝 พิมพ์ข้อความและเลือก Highlight</h3>

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

      <h3>🔍 Highlighted Text</h3>
      <div>
        {highlightedRanges.length > 0 ? (
          highlightedRanges.map((range, index) => (
            <span
              key={index}
              onClick={() => removeHighlight(index)}
              style={{
                backgroundColor: "yellow",
                cursor: "pointer",
                padding: "5px",
                margin: "5px",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              {text.slice(range.start, range.end)} ❌
            </span>
          ))
        ) : (
          <p style={{ color: "gray" }}>เลือกคำจาก textarea เพื่อทำ Highlight</p>
        )}
      </div>

      {highlightedRanges.length > 0 && (
        <button
          onClick={speakText}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔊 Speak Highlighted Text
        </button>
      )}

      <h3>📌 Highlighted in Text</h3>
      <div
        style={{
          whiteSpace: "pre-wrap",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        {text.split("").map((char, index) => {
          const isHighlighted = highlightedRanges.some(
            (range) => index >= range.start && index < range.end
          );
          return (
            <span
              key={index}
              style={{
                backgroundColor: isHighlighted ? "yellow" : "transparent",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default HightLightSpeakFollowSentence;


