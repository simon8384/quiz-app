import { useState } from "react";
import { Link } from "react-router-dom";

export default function QuizSelection({ setQuizConfig }) {
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4">Choose Your Quiz</h2>

      {/* Category */}
      <div className="mb-4">
        <label className="block mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="9">General Knowledge</option>
          <option value="21">Sports</option>
          <option value="23">History</option>
          <option value="17">Science & Nature</option>
        </select>
      </div>

      {/* Difficulty */}
      <div className="mb-4">
        <label className="block mb-2">Difficulty</label>
        <div className="flex gap-2">
          {["easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 rounded border ${
                difficulty === level ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions */}
      <div className="mb-4">
        <label className="block mb-2">Number of Questions</label>
        <div className="flex gap-2 flex-wrap">
          {[5, 10, 15, 20].map((num) => (
            <button
              key={num}
              onClick={() => setNumQuestions(num)}
              className={`px-4 py-2 rounded border ${
                numQuestions === num ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <Link
        to="/quiz"
        onClick={() => setQuizConfig({ category, difficulty, numQuestions })}
      >
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Start Quiz
        </button>
      </Link>
    </div>
  );
}
