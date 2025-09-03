import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QuizSelection from "./components/QuizSelection";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

export default function App() {
  const [quizConfig, setQuizConfig] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <QuizSelection
                  setQuizConfig={setQuizConfig}
                />
              }
            />
            <Route
              path="/quiz"
              element={
                <Quiz
                  quizConfig={quizConfig}
                  setScore={setScore}
                  setAnswers={setAnswers}
                />
              }
            />
            <Route
              path="/results"
              element={<Results score={score} answers={answers} />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
