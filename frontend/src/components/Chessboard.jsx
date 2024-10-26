import React, { useState } from 'react';
import { Chess } from 'chess.js';
import '../styles/ChessBoard.css';

function ChessBoard() {
    const [game, setGame] = useState(new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [moveHistory, setMoveHistory] = useState([]);

    const pieceImages = {
        w: {
            p: '/assets/whitepawn.png',
            n: '/assets/whiteknight.png',
            b: '/assets/whitebishop.png',
            r: '/assets/whiterook.png',
            q: '/assets/whitequeen.png',
            k: '/assets/whiteking.png',
        },
        b: {
            p: '/assets/blackpawn.png',
            n: '/assets/blackknight.png',
            b: '/assets/blackbishop.png',
            r: '/assets/blackrook.png',
            q: '/assets/blackqueen.png',
            k: '/assets/blackking.png',
        },
    };

    const onSquareClick = (square) => {
        const piece = game.get(square);

        if (selectedSquare) {
            if (piece && piece.color === game.turn()) {
                setSelectedSquare(square);
                setValidMoves(game.moves({ square, verbose: true }).map((m) => m.to));
            } else {
                const move = game.move({ from: selectedSquare, to: square });
                if (move) {
                    setGame(new Chess(game.fen()));
                    setMoveHistory([...moveHistory, move.san]);
                }
                setSelectedSquare(null);
                setValidMoves([]);
            }
        } else {
            if (piece && piece.color === game.turn()) {
                setSelectedSquare(square);
                setValidMoves(game.moves({ square, verbose: true }).map((m) => m.to));
            }
        }
    };

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setMoveHistory([]);
        setSelectedSquare(null);
        setValidMoves([]);
    };

    const renderSquare = (i, j) => {
        const position = `${'abcdefgh'[j]}${8 - i}`;
        const piece = game.get(position);
        const isLightSquare = (i + j) % 2 === 0;
        const isValidMove = validMoves.includes(position);
        const isSelected = position === selectedSquare;

        return (
            <div
                key={position}
                className={`square ${isLightSquare ? 'light' : 'dark'} ${
                    isValidMove ? 'highlight' : ''
                } ${isSelected ? 'selected' : ''}`}
                onClick={() => onSquareClick(position)}
            >
                {piece && (
                    <img
                        src={pieceImages[piece.color][piece.type]}
                        alt={`${piece.color}-${piece.type}`}
                        className="piece"
                    />
                )}
            </div>
        );
    };

    const gameStatus = game.isCheckmate()
        ? 'Checkmate'
        : game.isCheck()
        ? 'Check'
        : 'In Progress';

    return (
        <div className="chess-container">
            <div className="chessboard">
                {Array.from({ length: 8 }, (_, i) =>
                    Array.from({ length: 8 }, (_, j) => renderSquare(i, j))
                )}
            </div>

            <div className="game-info">
                <div className="game-status-box">
                    <strong>Game Status:</strong> <div>{gameStatus}</div>
                </div>

                <div className="move-history-box">
                    <strong>Move History:</strong>
                    <div className="history-table">
                        <div className="history-header">
                            <span>#</span>
                            <span>White</span>
                            <span>Black</span>
                        </div>
                        <div className="moves">
                            {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
                                (_, i) => (
                                    <div key={i} className="history-row">
                                        <span>{i + 1}</span>
                                        <span>{moveHistory[i * 2] || ''}</span>
                                        <span>{moveHistory[i * 2 + 1] || ''}</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <button className="reset-button" onClick={resetGame}>
                    Reset Game
                </button>
            </div>
        </div>
    );
};

export default ChessBoard;
