import { Link } from "react-router-dom";

export default function Results({ score, answers }) {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Score: {score}</h2>
      <ul className="space-y-4">
        {answers.map((ans, idx) => (
          <li key={idx} className="border p-3 rounded">
            <p dangerouslySetInnerHTML={{ __html: ans.question }} />
            <p>
              Correct Answer:{" "}
              <span className="text-green-600">{ans.correct}</span>
            </p>
            <p>
              Your Answer:{" "}
              {ans.chosen === ans.correct ? (
                <span className="text-green-600">{ans.chosen}</span>
              ) : (
                <span className="text-red-600">{ans.chosen}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
      <Link to="/">
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
          Play Again
        </button>
      </Link>
    </div>
  );
}
