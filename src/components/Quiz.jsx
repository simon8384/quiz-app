import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Quiz({ quizConfig, setScore, setAnswers }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (quizConfig) {
      axios
        .get(
          `https://opentdb.com/api.php?amount=${quizConfig.numQuestions}&category=${quizConfig.category}&difficulty=${quizConfig.difficulty}&type=multiple`
        )
        .then((res) => {
          setQuestions(
            res.data.results.map((q) => ({
              ...q,
              answers: shuffle([...q.incorrect_answers, q.correct_answer]),
            }))
          );
        });
    }
  }, [quizConfig]);

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function handleAnswer(answer) {
    setSelectedAnswer(answer);
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentIndex].question,
        correct: questions[currentIndex].correct_answer,
        chosen: answer,
      },
    ]);
    if (answer === questions[currentIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  }

  if (!questions.length)
    return <p className="p-4 text-center">Loading quiz...</p>;

  if (currentIndex >= questions.length)
    return (
      <div className="p-6 text-center">
        <Link to="/results">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            See Results
          </button>
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h3
        className="text-lg font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }}
      />
      <div className="flex flex-col gap-2">
        {questions[currentIndex].answers.map((answer) => (
          <button
            key={answer}
            onClick={() => handleAnswer(answer)}
            className={`px-4 py-2 border rounded ${
              selectedAnswer === answer ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
    </div>
  );
}
