import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../styles/ChessBoard.css';

const ItemTypes = {
    PIECE: 'piece',
};

// Image paths for pieces
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

function ChessPiece({ piece, position, onDrop }) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PIECE,
        item: { position },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                onDrop(item.position, dropResult.position);
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const pieceImagePath = pieceImages[piece.color][piece.type];

    return (
        <img
            ref={drag}
            src={pieceImagePath}
            alt={`${piece.color}-${piece.type}`}
            className="piece"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        />
    );
}

function ChessSquare({ position, piece, onSquareClick, isLightSquare, isValidMove, isSelected, onDrop }) {
    const [, drop] = useDrop({
        accept: ItemTypes.PIECE,
        drop: () => ({ position }),
    });

    return (
        <div
            ref={drop}
            className={`square ${isLightSquare ? 'light' : 'dark'} ${isValidMove ? 'highlight' : ''} ${
                isSelected ? 'selected' : ''
            }`}
            onClick={() => onSquareClick(position)}
        >
            {piece && <ChessPiece piece={piece} position={position} onDrop={onDrop} />}
        </div>
    );
}

function ChessBoard() {
    const [game, setGame] = useState(new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [moveHistory, setMoveHistory] = useState([]);
    const [showPromotion, setShowPromotion] = useState(null);

    const handlePromotion = (promotionPiece) => {
        const move = game.move({
            from: showPromotion.from,
            to: showPromotion.to,
            promotion: promotionPiece,
        });
        if (move) {
            setGame(new Chess(game.fen()));
            setMoveHistory([...moveHistory, move.san]);
        }
        setSelectedSquare(null);
        setValidMoves([]);
        setShowPromotion(null);
    };

    const onSquareClick = (square) => {
        const piece = game.get(square);

        if (selectedSquare === square) {
            setSelectedSquare(null);
            setValidMoves([]);
        } else if (selectedSquare) {
            const possibleMove = game.moves({ square: selectedSquare, verbose: true }).find((m) => m.to === square);
            if (possibleMove && possibleMove.promotion) {
                setShowPromotion({ from: selectedSquare, to: square });
            } else if (possibleMove) {
                const move = game.move({ from: selectedSquare, to: square });
                if (move) {
                    setGame(new Chess(game.fen()));
                    setMoveHistory([...moveHistory, move.san]);
                }
                setSelectedSquare(null);
                setValidMoves([]);
            } else if (piece && piece.color === game.turn()) {
                setSelectedSquare(square);
                setValidMoves(game.moves({ square, verbose: true }).map((m) => m.to));
            } else {
                setSelectedSquare(null);
                setValidMoves([]);
            }
        } else if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
            setValidMoves(game.moves({ square, verbose: true }).map((m) => m.to));
            setShowPromotion(null);
        }
    };

    const handleDrop = (fromSquare, toSquare) => {
        const possibleMove = game.moves({ square: fromSquare, verbose: true }).find((m) => m.to === toSquare);
        if (possibleMove && possibleMove.promotion) {
            setShowPromotion({ from: fromSquare, to: toSquare });
        } else if (possibleMove) {
            const move = game.move({ from: fromSquare, to: toSquare });
            if (move) {
                setGame(new Chess(game.fen()));
                setMoveHistory([...moveHistory, move.san]);
            }
            setSelectedSquare(null);
            setValidMoves([]);
        }
    };

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setMoveHistory([]);
        setSelectedSquare(null);
        setValidMoves([]);
        setShowPromotion(null);
    };

    const renderSquare = (i, j) => {
        const position = `${'abcdefgh'[j]}${8 - i}`;
        const piece = game.get(position);
        const isLightSquare = (i + j) % 2 === 0;
        const isValidMove = validMoves.includes(position);
        const isSelected = position === selectedSquare;

        return (
            <ChessSquare
                key={position}
                position={position}
                piece={piece}
                onSquareClick={onSquareClick}
                onDrop={handleDrop}
                isLightSquare={isLightSquare}
                isValidMove={isValidMove}
                isSelected={isSelected}
            />
        );
    };

    const gameStatus = game.isCheckmate()
        ? 'Checkmate'
        : game.isCheck()
        ? 'Check'
        : `Turn: ${game.turn() === 'w' ? 'White' : 'Black'}`;

    return (
        <DndProvider backend={HTML5Backend}>
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

                    {showPromotion && (
                        <div className="promotion-box">
                            <div>Select Promotion:</div>
                            <button onClick={() => handlePromotion('q')}>Queen</button>
                            <button onClick={() => handlePromotion('r')}>Rook</button>
                            <button onClick={() => handlePromotion('b')}>Bishop</button>
                            <button onClick={() => handlePromotion('n')}>Knight</button>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
}

export default ChessBoard;
