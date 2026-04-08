export interface ChessPuzzle {
  id: number;
  label: string;
  fen: string;
  solution: string[]; // UCI move format e.g. "e2e4"
  orientation: "white" | "black";
  hint: string;
}

// Classic well-known puzzles
export const puzzles: ChessPuzzle[] = [
  {
    id: 1,
    label: "Easy — Mate in 1",
    fen: "6k1/5ppp/8/8/8/8/1Q3PPP/6K1 w - - 0 1",
    solution: ["b2b8"],
    orientation: "white",
    hint: "The queen can deliver checkmate on the back rank.",
  },
  {
    id: 2,
    label: "Medium — Find the Fork",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 3",
    solution: ["f3g5"],
    orientation: "white",
    hint: "Attack two weak points at once.",
  },
  {
    id: 3,
    label: "Hard — Mate in 2",
    fen: "r1b1kb1r/pppp1ppp/5q2/4n3/3KP3/2N3PN/PPP4P/R1BQ1B1R b kq - 0 1",
    solution: ["f6f2"],
    orientation: "black",
    hint: "The king is exposed. Find the forcing move.",
  },
];
