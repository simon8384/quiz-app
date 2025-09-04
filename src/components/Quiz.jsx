import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Quiz({ quizConfig, setScore, setAnswers, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Utility: shuffle answers
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // Utility: decode HTML entities
  const decodeHtml = (text) => {
    const el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
  };

  // Get or request OpenTDB session token
  const fetchToken = async () => {
    const storedToken = localStorage.getItem("opentdbToken");
    if (storedToken) return storedToken;

    try {
      const res = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );
      const data = await res.json();
      if (data.response_code === 0 && data.token) {
        localStorage.setItem("opentdbToken", data.token);
        return data.token;
      } else {
        throw new Error("Failed to get session token");
      }
    } catch (err) {
      console.error("Token fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!quizConfig) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");

      try {
        const category = quizConfig.category || 9;
        const difficulty = quizConfig.difficulty || "medium";
        const amount = quizConfig.numQuestions || 10;

        const token = await fetchToken();
        let url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        if (token) url += `&token=${token}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);

        const data = await res.json();

        if (data.response_code === 4) {
          localStorage.removeItem("opentdbToken");
          return fetchQuestions();
        }

        if (!data.results || data.results.length === 0) {
          throw new Error("No questions available from API");
        }

        const formatted = data.results.map((q) => ({
          ...q,
          difficulty: q.difficulty || "medium",
          answers: shuffle([...q.incorrect_answers, q.correct_answer]),
        }));

        setQuestions(formatted);
      } catch (err) {
        console.warn("API failed, using fallback questions:", err);
        setError("API limit reached or server unavailable. Using fallback questions.");

        const fallbackPool = [
          {
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
            difficulty: "medium",
          },
          {
            question: "What planet is known as the Red Planet?",
            correct_answer: "Mars",
            incorrect_answers: ["Venus", "Jupiter", "Saturn"],
            difficulty: "medium",
          },
          {
            question: "Who wrote 'Romeo and Juliet'?",
            correct_answer: "William Shakespeare",
            incorrect_answers: ["Charles Dickens", "Leo Tolstoy", "Mark Twain"],
            difficulty: "medium",
          },
          {
            question: "What is H2O commonly known as?",
            correct_answer: "Water",
            incorrect_answers: ["Oxygen", "Hydrogen", "Salt"],
            difficulty: "medium",
          },
          {
            question: "Which element has the chemical symbol 'Au'?",
            correct_answer: "Gold",
            incorrect_answers: ["Silver", "Oxygen", "Iron"],
            difficulty: "medium",
          },
        ];

        const selected = [];
        for (let i = 0; i < (quizConfig.numQuestions || 10); i++) {
          const q = fallbackPool[i % fallbackPool.length];
          selected.push({
            ...q,
            answers: shuffle([...q.incorrect_answers, q.correct_answer]),
          });
        }

        setQuestions(selected);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizConfig]);

  const handleAnswer = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const correct = questions[currentIndex].correct_answer;
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentIndex].question,
        correct,
        chosen: answer,
      },
    ]);

    if (answer === correct) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz finished
      if (onComplete) onComplete();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );

  if (!questions || questions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No questions available.</p>
      </div>
    );

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {error && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-gray-600 text-sm">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="capitalize">{current.difficulty}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">{decodeHtml(current.question)}</h3>

        {/* Answers */}
        <div className="grid gap-3">
          {current.answers.map((answer, idx) => {
            const isCorrect = answer === current.correct_answer;
            const isSelected = answer === selectedAnswer;
            const isIncorrect = showAnswer && isSelected && !isCorrect;

            let baseClasses =
              "px-4 py-3 rounded-xl border transition flex items-center gap-3 cursor-pointer text-left";
            if (showAnswer && isCorrect)
              baseClasses += " bg-green-100 border-green-500";
            else if (isIncorrect)
              baseClasses += " bg-red-100 border-red-500";
            else if (isSelected)
              baseClasses += " bg-indigo-600 text-white border-indigo-600";
            else
              baseClasses += " bg-gray-100 border-gray-300 hover:bg-gray-200";

            return (
              <button
                key={idx}
                className={baseClasses}
                onClick={() => handleAnswer(answer)}
                disabled={showAnswer}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            );
          })}
        </div>

        {/* Next / Finish Button */}
        <div className="flex justify-end mt-4">
          {showAnswer && (
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
            >
              {currentIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
