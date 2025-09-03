import { RotateCcw } from "lucide-react";

export default function Header({ onReset, showReset = false }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">Q</span>
          </div>
          <h1 className="text-black text-lg font-bold">Quiz Master</h1>
        </div>
        {showReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            New Quiz
          </button>
        )}
      </div>
    </header>
  );
}
