"use client";
import React, { useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";

const words = [
  { id: "a", text: "a" },
  { id: "an", text: "an" },
];

const blanks = [
  { id: "blank-1", correct: "a", label: "pencil" },
  { id: "blank-2", correct: "an", label: "ruler" },
  { id: "blank-3", correct: "a", label: "atlas" },
  { id: "blank-4", correct: "an", label: "notebook" },
  { id: "blank-5", correct: "a", label: "rubber" },
  { id: "blank-6", correct: "a", label: "pen" },
];

const DraggableWord = ({ id, text }: { id: string; text: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "8px 16px",
        margin: "5px",
        fontSize: "16px",
        backgroundColor: "#fff",
        border: "1px solid #000",
        borderRadius: "5px",
        cursor: "grab",
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      }}
    >
      {text}
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
          height: "24px",
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

const ArticleMatchingGame: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: string | null }>({});
  const [showResult, setShowResult] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      setDroppedItems((prev) => ({ ...prev, [over.id as string]: active.id as string }));
      setShowResult(false); // ซ่อนผลลัพธ์เมื่อมีการลากใหม่
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

  const clearAnswers = () => {
    setDroppedItems({});
    setShowResult(false);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* พื้นที่ลากตัวอักษร */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        {words.map((word) => (
          <DraggableWord key={word.id} id={word.id} text={word.text} />
        ))}
      </div>

      {/* ตารางที่มีช่องว่างให้เติม */}
      <div style={{ maxWidth: "400px", margin: "0 auto", fontSize: "18px" }}>
        {blanks.map((blank, index) => (
          <div key={blank.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span>{index + 1}.</span>
            <DropArea
              id={blank.id}
              answer={droppedItems[blank.id] || null}
              correct={blank.correct}
              showResult={showResult}
              onRemove={() => handleRemove(blank.id)}
            />
            <span>{blank.label}</span>
          </div>
        ))}
      </div>

      {/* ปุ่มตรวจสอบและล้างค่า */}
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
          onClick={clearAnswers}
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
          Clear
        </button>
      </div>
    </DndContext>
  );
};

export default ArticleMatchingGame;
