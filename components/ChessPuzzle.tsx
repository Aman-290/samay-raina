"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { puzzles } from "@/lib/chess-puzzles";
import { playSound } from "@/lib/audio";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false, loading: () => <div className="w-full aspect-square bg-concrete rounded animate-pulse" /> }
);

export default function ChessPuzzleComponent() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [game, setGame] = useState<any>(null);
  const [Chess, setChess] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);

  const puzzle = puzzles[puzzleIndex];

  useEffect(() => {
    import("chess.js").then((mod) => {
      const ChessClass = mod.Chess;
      setChess(() => ChessClass);
      setGame(new ChessClass(puzzle.fen));
    });
  }, [puzzle.fen]);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: { piece: any; sourceSquare: string; targetSquare: string | null }): boolean => {
      if (!game || !Chess || solved || !targetSquare || sourceSquare === targetSquare) return false;

      const gameCopy = new Chess(game.fen());
      let move;
      try {
        move = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
      } catch {
        return false;
      }

      if (!move) return false;

      const expectedMove = puzzle.solution[moveIndex];
      const uci = move.from + move.to;

      if (uci === expectedMove) {
        if (gameCopy.isCheckmate() || moveIndex >= puzzle.solution.length - 1) {
          setMessage("✓ Samay would be proud!");
          setSolved(true);
          playSound("roast", "/audio/roast-clip.mp3", { volume: 0.5 });
        } else {
          setMoveIndex((prev) => prev + 1);
          setMessage("Correct! Keep going...");
        }
        setGame(gameCopy);
        return true;
      } else {
        setMessage("Bhai, phir se try kar 😂");
        setTimeout(() => setMessage(puzzle.hint), 2000);
        return false;
      }
    },
    [game, Chess, puzzle, solved, moveIndex]
  );

  const nextPuzzle = () => {
    if (puzzleIndex < puzzles.length - 1) {
      const next = puzzleIndex + 1;
      setPuzzleIndex(next);
      setSolved(false);
      setMoveIndex(0);
      setMessage("");
      if (Chess) {
        setGame(new Chess(puzzles[next].fen));
      }
    }
  };

  return (
    <div className="bg-cell border-2 border-steel rounded p-4 md:p-6">
      <div className="font-space text-[10px] text-gold tracking-[2px] mb-3">
        INTERACTIVE: CHESS PUZZLE — {puzzle?.label}
      </div>

      <div className="max-w-[320px] mx-auto">
        {game && (
          <Chessboard
            options={{
              id: "samay-puzzle",
              position: game.fen(),
              onPieceDrop: onDrop,
              boardOrientation: puzzle.orientation,
              boardStyle: {
                borderRadius: "4px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              },
              darkSquareStyle: { backgroundColor: "#3A3A3C" },
              lightSquareStyle: { backgroundColor: "#6B6B6F" },
              animationDurationInMs: 200,
            }}
          />
        )}
      </div>

      {message && (
        <p className={`font-dm text-sm text-center mt-4 ${solved ? "text-alive" : "text-gold"}`}>
          {message}
        </p>
      )}

      {solved && puzzleIndex < puzzles.length - 1 && (
        <button
          onClick={nextPuzzle}
          className="block mx-auto mt-4 px-6 py-2 bg-gold text-cell font-space text-xs tracking-[1px] rounded hover:brightness-110 transition-all"
        >
          NEXT PUZZLE →
        </button>
      )}

      {solved && puzzleIndex === puzzles.length - 1 && (
        <p className="font-caveat text-xl text-gold text-center mt-4">
          All puzzles solved! You might actually beat Samay. 🏆
        </p>
      )}
    </div>
  );
}
