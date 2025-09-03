import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function Quiz({ quizConfig, setScore, setAnswers }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!quizConfig) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const category = quizConfig.category || 9;
        const difficulty = quizConfig.difficulty || "medium";
        const amount = quizConfig.numQuestions || 10;

        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        const res = await fetch(url);

        // Handle 429 or other non-ok responses
        if (!res.ok) {
          if (res.status === 429) {
            throw new Error(
              "Too many requests. Please wait a moment and try again."
            );
          } else {
            throw new Error(`Network response was not ok (${res.status})`);
          }
        }

        const data = await res.json();

        if (!data.results || data.results.length === 0)
          throw new Error("No questions available for this configuration");

        const formatted = data.results.map((q) => ({
          ...q,
          answers: shuffle([...q.incorrect_answers, q.correct_answer]),
        }));

        setQuestions(formatted);
      } catch (err) {
        console.error(err);

        // Fallback to mock questions if API fails (development friendly)
        const fallbackQuestions = [
          {
            category: "General Knowledge",
            type: "multiple",
            difficulty: "medium",
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
            answers: shuffle(["Paris", "London", "Berlin", "Madrid"]),
          },
          {
            category: "Science & Nature",
            type: "multiple",
            difficulty: "medium",
            question: "What planet is known as the Red Planet?",
            correct_answer: "Mars",
            incorrect_answers: ["Venus", "Jupiter", "Saturn"],
            answers: shuffle(["Mars", "Venus", "Jupiter", "Saturn"]),
          },
        ];

        setQuestions(fallbackQuestions);
        setError(err.message || "Failed to load questions. Using fallback.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizConfig]);

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const decodeHtml = (text) => {
    const el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
  };

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

  if (error)
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );

  if (currentIndex >= questions.length)
    return (
      <div className="p-6 text-center">
        <Link to="/results">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition">
            See Results
          </button>
        </Link>
      </div>
    );

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
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

        {/* Next / Show Answer */}
        <div className="flex justify-end mt-4">
          {showAnswer && (
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
            >
              {currentIndex < questions.length - 1
                ? "Next Question"
                : "View Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
