import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Play, XCircle } from "lucide-react";

export default function QuizSelection({ setQuizConfig }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://opentdb.com/api_category.php");

      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests. Please try again later.");
        else throw new Error("Network response was not ok");
      }

      const data = await res.json();
      if (!data.trivia_categories || data.trivia_categories.length === 0) throw new Error("No categories available");

      setCategories(data.trivia_categories);
      setCategory(data.trivia_categories[0].id);
    } catch (err) {
      console.error(err);
      setError(err.message + " Using fallback categories.");

      // Fallback categories
      const fallback = [
        { id: 9, name: "General Knowledge" },
        { id: 17, name: "Science & Nature" },
        { id: 21, name: "Sports" },
        { id: 23, name: "History" },
      ];
      setCategories(fallback);
      setCategory(fallback[0].id);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-1">Choose Your Quiz</h2>
          <p className="text-black/70">Select a category, difficulty, and number of questions</p>
        </div>
        <hr className="my-6 border-gray-300" />

        {error && (
          <div className="flex items-center gap-2 mb-4 text-red-600 text-sm">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Category */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm hover:shadow-md transition"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Difficulty
          </label>
          <div className="flex gap-3">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 px-5 py-2 rounded-xl font-medium border transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 ${
                  difficulty === level
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            Number of Questions
          </label>
          <div className="flex gap-3 flex-wrap">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setNumQuestions(num)}
                className={`px-5 py-2 rounded-xl font-medium border transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 ${
                  numQuestions === num
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Start Quiz */}
        <Link
          to="/quiz"
          onClick={() =>
            setQuizConfig({ category, difficulty, numQuestions })
          }
        >
          <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Start Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
