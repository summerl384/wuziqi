import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const boardSize = 15;

  function handleClick(row, col) {
    if (calculateWinner(squares) || squares[row][col]) {
      return;
    }
    const nextSquares = squares.map((row) => row.slice());
    nextSquares[row][col] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "玩家  " + winner + " 赢了！";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((square, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                value={square}
                onSquareClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const boardSize = 15;
  const [history, setHistory] = useState([
    Array.from({ length: boardSize }, () => Array(boardSize).fill(null)),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const boardSize = squares.length;
  const directions = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonal (
    [1, -1], // Diagonal /
  ];

  function inBounds(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  }

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const player = squares[row][col];
      if (!player) continue;

      for (let [dRow, dCol] of directions) {
        let count = 1;

        for (let step = 1; step < 5; step++) {
          const newRow = row + step * dRow;
          const newCol = col + step * dCol;
          if (inBounds(newRow, newCol) && squares[newRow][newCol] === player) {
            count++;
          } else {
            break;
          }
        }

        if (count === 5) {
          return player;
        }
      }
    }
  }

  return null;
}
