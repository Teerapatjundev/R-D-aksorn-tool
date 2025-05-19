"use client";
import React, { useState, useRef } from "react";

const TextLetter = ({ id }: { id: string }) => {
  return (
    <button
      style={{
        padding: "8px 12px",
        margin: "5px",
        fontSize: "16px",
        backgroundColor: "#fff",
        border: "1px solid #000",
        borderRadius: "5px",
        cursor: "grab",
      }}
    >
      {id}
    </button>
  );
};

const LetterMatchingGame: React.FC = () => {
  const initialLetters = ["aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee"];
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [finishGame, setFinishGame] = useState<boolean>(false);
  const [blanksMulti, setBlanksMulti] = useState<
    { id: string; result: string; correct: string }[]
  >([
    { id: "blank-1", result: "", correct: "aaaaa" },
    { id: "blank-2", result: "", correct: "eeeee" },
    { id: "blank-3", result: "", correct: "ddddd" },
    { id: "blank-4", result: "", correct: "ccccc" },
    { id: "blank-5", result: "", correct: "bbbbb" },
  ]);

  const funcAnswer = () => {
    setFinishGame(true);
    // const values = inputRefs.current.map((input) => input?.value || "");
    // console.log("Submitted values:", values);
  };

  const resetForm = () => {
    setFinishGame(false);
    setBlanksMulti(blanksMulti.map((row) => ({ ...row, result: "" })));
    inputRefs.current.forEach((input) => {
      if (input) input.value = "";
    });
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {initialLetters.map((letter) => {
          return <TextLetter id={letter} />;
        })}
      </div>

      {/* ตารางเวลาพร้อมช่องว่างให้เติม */}
      <div style={{ maxWidth: "400px", margin: "0 auto", fontSize: "18px" }}>
        {blanksMulti.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span>{index + 1}.</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                ref={(el) => {
                  inputRefs.current[index] = el!;
                }}
                readOnly={finishGame}
                maxLength={10}
                type="text"
                onChange={(e) => {
                  let item = blanksMulti[index];
                  item.result = e.target.value;
                  const merged = [
                    ...blanksMulti.slice(0, index), // ก่อนตำแหน่ง index
                    item, // แทนที่ตำแหน่ง index
                    ...blanksMulti.slice(index + 1), // หลังตำแหน่ง index
                  ];
                  setBlanksMulti(merged);
                }}
                style={{
                  width: "150px",
                  height: "30px",
                  textAlign: "center",
                  border: "1px solid black",
                  marginRight: "5px",
                  backgroundColor: finishGame
                    ? item.correct === item.result
                      ? "lightgreen" // ✅ ถูกต้อง
                      : "lightcoral" // ❌ ผิด
                    : "white",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มตรวจสอบและรีเซ็ต */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => {
            funcAnswer();
          }}
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
          onClick={() => {
            resetForm();
          }}
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
    </React.Fragment>
  );
};

export default LetterMatchingGame;
