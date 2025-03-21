"use client";
import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const initialLetters = ["a", "e", "d", "h", "f", "b", "c", "l", "m", "n"];

const blanks = [
  { id: "blank-1", correct: "d" }, // Maths
  { id: "blank-2", correct: "c" }, // IT
  { id: "blank-3", correct: "e" }, // PE
  { id: "blank-4", correct: "f" }, // Science
  { id: "blank-5", correct: "b" }, // History
];

const DraggableLetter = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "8px 12px",
        margin: "5px",
        fontSize: "16px",
        backgroundColor: "#fff",
        border: "1px solid #000",
        borderRadius: "5px",
        cursor: "grab",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {id}
    </button>
  );
};

const DropArea = ({
  id,
  answer,
  correct,
  showResult,
  onRemove,
}: {
  id: string;
  answer: string | null;
  correct: string;
  showResult: boolean;
  onRemove: () => void;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
     <input
        ref={setNodeRef}
        onClick={answer ? onRemove : undefined}
        type="text"
        value={answer || ""}
        readOnly
        style={{
          width: "40px",
          height: "30px",
          textAlign: "center",
          border: "1px solid black",
          marginRight: "5px",
          backgroundColor: showResult
            ? answer === correct
              ? "lightgreen" // ✅ ถูกต้อง
              : "lightcoral" // ❌ ผิด
            : "white",
        }}
      />
      {showResult && answer && (
        <span style={{ marginLeft: "10px", fontSize: "18px" }}>
          {answer === correct ? "✅" : "❌"}
        </span>
      )}
    </div>
  );
};

const LetterMatchingGame: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<{
    [key: string]: string | null;
  }>({});
  const [showResult, setShowResult] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over) {
      // ค้นหาว่าตัวอักษรนี้ถูกใช้ที่ช่องไหนอยู่ก่อนหน้านี้
      const prevSlot = Object.keys(droppedItems).find(
        (key) => droppedItems[key] === active.id
      );
      
      setDroppedItems((prev) => {
        const newState = { ...prev };

        // เอาตัวอักษรออกจากช่องเดิม (ถ้ามี)
        if (prevSlot) {
          newState[prevSlot] = null;
        }
        
        // วางตัวอักษรที่ช่องใหม่
        newState[over.id] = active.id;

        return newState;
      });

      // ซ่อนผลลัพธ์เมื่อมีการลากใหม่
      setShowResult(false);
    }
  };

  const handleRemove = (id: string) => {
    setDroppedItems((prev) => {
      const newState = { ...prev };
      newState[id] = null; // ลบค่าจากช่อง
      return newState;
    });
    setShowResult(false);
  };

  const checkAnswers = () => {
    setShowResult(true);
  };

  const resetGame = () => {
    setDroppedItems({});
    setShowResult(false);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* พื้นที่ลากตัวอักษร */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {initialLetters.map((letter) => {
          // แสดงเฉพาะตัวอักษรที่ยังไม่มีในช่องใดๆ
          const isUsed = Object.values(droppedItems).includes(letter);
          return !isUsed ? <DraggableLetter key={letter} id={letter} /> : null;
        })}
      </div>

      {/* ตารางเวลาพร้อมช่องว่างให้เติม */}
      <div style={{ maxWidth: "400px", margin: "0 auto", fontSize: "18px" }}>
        {blanks.map((blank, index) => (
          <div
            key={blank.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span>{index + 1}.</span>
            <DropArea
              id={blank.id}
              answer={droppedItems[blank.id] || null}
              correct={blank.correct}
              showResult={showResult}
              onRemove={() => handleRemove(blank.id)}
            />
          </div>
        ))}
      </div>

      {/* ปุ่มตรวจสอบและรีเซ็ต */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={checkAnswers}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            margin: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Check Answer
        </button>
        <button
          onClick={resetGame}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            margin: "5px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </DndContext>
  );
};

export default LetterMatchingGame;
