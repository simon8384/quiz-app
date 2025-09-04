import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QuizSelection from "./components/QuizSelection";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

// Wrapper component to use useNavigate
function AppRoutes() {
  const [quizConfig, setQuizConfig] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showReset, setShowReset] = useState(false);

  const navigate = useNavigate();

  // Reset quiz state
  const handleReset = () => {
    setQuizConfig(null);
    setScore(0);
    setAnswers([]);
    setShowReset(false);
    navigate("/"); // Go back to quiz selection
  };

  // Called when quiz completes
  const handleQuizComplete = () => {
    setShowReset(true); // Show "New Quiz" button
    navigate("/results"); // Navigate to results page
  };

  return (
    <>
      <Header onReset={handleReset} showReset={showReset} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<QuizSelection setQuizConfig={setQuizConfig} />} />
          <Route
            path="/quiz"
            element={
              <Quiz
                quizConfig={quizConfig}
                setScore={setScore}
                setAnswers={setAnswers}
                onComplete={handleQuizComplete}
              />
            }
          />
          <Route path="/results" element={<Results score={score} answers={answers} />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppRoutes />
      </div>
    </Router>
  );
}
