import { useState, useCallback } from 'react';
import './ChessBoard.scss';

export interface ChessBoardProps {
  selected?: boolean;
}

type Piece = string | null;
type Board = Piece[][];
type Position = [number, number];

const INITIAL_BOARD: Board = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const WHITE_PIECES = ['♔', '♕', '♖', '♗', '♘', '♙'];
const BLACK_PIECES = ['♚', '♛', '♜', '♝', '♞', '♟'];

function isWhite(piece: Piece): boolean {
  return piece ? WHITE_PIECES.includes(piece) : false;
}

function isBlack(piece: Piece): boolean {
  return piece ? BLACK_PIECES.includes(piece) : false;
}

function getValidMoves(board: Board, row: number, col: number): Position[] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: Position[] = [];
  const white = isWhite(piece);

  const addIfValid = (r: number, c: number): boolean => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false;
    const target = board[r][c];
    if (!target) { moves.push([r, c]); return true; }
    if (white ? isBlack(target) : isWhite(target)) { moves.push([r, c]); }
    return false;
  };

  const slideDirs = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        const nr = row + dr * i, nc = col + dc * i;
        if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
        const t = board[nr][nc];
        if (!t) { moves.push([nr, nc]); continue; }
        if (white ? isBlack(t) : isWhite(t)) moves.push([nr, nc]);
        break;
      }
    }
  };

  if (piece === '♙') {
    if (row > 0 && !board[row - 1][col]) { moves.push([row - 1, col]); if (row === 6 && !board[row - 2][col]) moves.push([row - 2, col]); }
    if (row > 0 && col > 0 && isBlack(board[row - 1][col - 1])) moves.push([row - 1, col - 1]);
    if (row > 0 && col < 7 && isBlack(board[row - 1][col + 1])) moves.push([row - 1, col + 1]);
  } else if (piece === '♟') {
    if (row < 7 && !board[row + 1][col]) { moves.push([row + 1, col]); if (row === 1 && !board[row + 2][col]) moves.push([row + 2, col]); }
    if (row < 7 && col > 0 && isWhite(board[row + 1][col - 1])) moves.push([row + 1, col - 1]);
    if (row < 7 && col < 7 && isWhite(board[row + 1][col + 1])) moves.push([row + 1, col + 1]);
  } else if (piece === '♘' || piece === '♞') {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) addIfValid(row + dr, col + dc);
  } else if (piece === '♗' || piece === '♝') {
    slideDirs([[-1,-1],[-1,1],[1,-1],[1,1]]);
  } else if (piece === '♖' || piece === '♜') {
    slideDirs([[-1,0],[1,0],[0,-1],[0,1]]);
  } else if (piece === '♕' || piece === '♛') {
    slideDirs([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
  } else if (piece === '♔' || piece === '♚') {
    for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) addIfValid(row + dr, col + dc);
  }

  return moves;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function ChessBoard({ selected = false }: ChessBoardProps) {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD.map(r => [...r]));
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [captured, setCaptured] = useState<{ white: string[]; black: string[] }>({ white: [], black: [] });

  const handleClick = useCallback((row: number, col: number) => {
    const piece = board[row][col];

    if (selectedPos) {
      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      if (isValid) {
        const newBoard = board.map(r => [...r]);
        const target = newBoard[row][col];
        if (target) {
          setCaptured(prev => ({
            ...prev,
            [turn]: [...prev[turn], target],
          }));
        }
        newBoard[row][col] = newBoard[selectedPos[0]][selectedPos[1]];
        newBoard[selectedPos[0]][selectedPos[1]] = null;
        setBoard(newBoard);
        setTurn(turn === 'white' ? 'black' : 'white');
        setSelectedPos(null);
        setValidMoves([]);
        return;
      }
    }

    if (piece && ((turn === 'white' && isWhite(piece)) || (turn === 'black' && isBlack(piece)))) {
      setSelectedPos([row, col]);
      setValidMoves(getValidMoves(board, row, col));
    } else {
      setSelectedPos(null);
      setValidMoves([]);
    }
  }, [board, selectedPos, validMoves, turn]);

  const handleReset = () => {
    setBoard(INITIAL_BOARD.map(r => [...r]));
    setSelectedPos(null);
    setValidMoves([]);
    setTurn('white');
    setCaptured({ white: [], black: [] });
  };

  const isSelected = (r: number, c: number) => selectedPos?.[0] === r && selectedPos?.[1] === c;
  const isValidMove = (r: number, c: number) => validMoves.some(([mr, mc]) => mr === r && mc === c);

  const classes = ['jf-chess', selected && 'jf-chess--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="jf-chess__header">
        <div className="jf-chess__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 16l1.5-6.5h5L16 16" />
            <path d="M6 20h12" />
            <path d="M12 4v2" />
            <path d="M9 6h6" />
            <circle cx="12" cy="3" r="1" />
          </svg>
        </div>
        <div className="jf-chess__header-text">
          <h3 className="jf-chess__title">Chess</h3>
          <p className="jf-chess__subtitle">
            {turn === 'white' ? 'White' : 'Black'} to move
          </p>
        </div>
        <button className="jf-chess__reset" onClick={handleReset}>Reset</button>
      </div>

      {(captured.white.length > 0 || captured.black.length > 0) && (
        <div className="jf-chess__captured">
          {captured.white.length > 0 && (
            <div className="jf-chess__captured-row">
              <span className="jf-chess__captured-label">White captured:</span>
              <span className="jf-chess__captured-pieces">{captured.white.join(' ')}</span>
            </div>
          )}
          {captured.black.length > 0 && (
            <div className="jf-chess__captured-row">
              <span className="jf-chess__captured-label">Black captured:</span>
              <span className="jf-chess__captured-pieces">{captured.black.join(' ')}</span>
            </div>
          )}
        </div>
      )}

      <div className="jf-chess__board-wrapper">
        <div className="jf-chess__ranks">
          {RANKS.map(r => <span key={r} className="jf-chess__coord">{r}</span>)}
        </div>
        <div className="jf-chess__board">
          {board.map((row, ri) =>
            row.map((piece, ci) => {
              const isDark = (ri + ci) % 2 === 1;
              const cellClasses = [
                'jf-chess__cell',
                isDark ? 'jf-chess__cell--dark' : 'jf-chess__cell--light',
                isSelected(ri, ci) && 'jf-chess__cell--selected',
                isValidMove(ri, ci) && 'jf-chess__cell--valid',
                isValidMove(ri, ci) && piece && 'jf-chess__cell--capture',
              ].filter(Boolean).join(' ');

              return (
                <div key={`${ri}-${ci}`} className={cellClasses} onClick={() => handleClick(ri, ci)}>
                  {piece && <span className={`jf-chess__piece ${isBlack(piece) ? 'jf-chess__piece--black' : 'jf-chess__piece--white'}`}>{piece}</span>}
                  {isValidMove(ri, ci) && !piece && <span className="jf-chess__dot" />}
                </div>
              );
            })
          )}
        </div>
        <div className="jf-chess__files">
          {FILES.map(f => <span key={f} className="jf-chess__coord">{f}</span>)}
        </div>
      </div>
    </div>
  );
}

export default ChessBoard;
