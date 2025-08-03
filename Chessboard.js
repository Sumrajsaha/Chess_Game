import React, { useState, useEffect, useRef } from "react";
import Square from "./Square";
import { Chess } from "chess.js";
import Loading from "./Loading";
import { playSound, preloadSounds } from "../utils/sound";
import AnimatedPiece from "./AnimatedPiece";

const Chessboard = ({ gameMode, difficulty = 'medium', onBack }) => {
  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState(null);
  const [board, setBoard] = useState(game.board());
  const [highlightSquares, setHighlightSquares] = useState([]);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [promotionMove, setPromotionMove] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
  const [lastMove, setLastMove] = useState({ from: null, to: null });
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [gameStats, setGameStats] = useState({
    moves: 0,
    checks: 0,
    captures: 0
  });
  const [animatingPiece, setAnimatingPiece] = useState(null);
  
  const gameRef = useRef(game);
  gameRef.current = game;

  // Preload sounds on component mount
  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    if (game.isCheckmate()) {
      setStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
      playSound('gameEnd');
    } else if (game.isDraw()) {
      setStatus("Draw!");
      playSound('gameEnd');
    } else if (game.isCheck()) {
      setStatus("Check!");
      playSound('check');
      setGameStats(prev => ({ ...prev, checks: prev.checks + 1 }));
    } else {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    }
  }, [game]);

  // Effect for AI move
  useEffect(() => {
    if (gameMode === 'ai' && game.turn() === 'b' && !game.isGameOver() && !aiThinking) {
      makeAiMove();
    }
  }, [game, gameMode, aiThinking]);

  const getSquareName = (row, col) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return files[col] + (8 - row);
  };

  const handleSquareClick = (row, col) => {
    playSound('click');
    
    if (aiThinking || game.isGameOver()) return;
    
    // Prevent black moves in AI mode
    if (gameMode === 'ai' && game.turn() === 'b') return;
    
    const square = getSquareName(row, col);
    
    if (selected) {
      const piece = game.get(selected);
      const isPromotion = piece && piece.type === 'p' && 
        ((piece.color === 'w' && square[1] === '8') || 
         (piece.color === 'b' && square[1] === '1'));
      
      if (isPromotion) {
        setPromotionMove({ from: selected, to: square });
        setSelected(null);
        setHighlightSquares([]);
        playSound('notify');
        return;
      }
      
      const move = {
        from: selected,
        to: square,
        promotion: "q",
      };

      const newGame = new Chess(game.fen());
      const result = newGame.move(move);

      if (result) {
        // Set animating piece
        setAnimatingPiece({
          from: selected,
          to: square,
          piece: symbols[piece.type][piece.color],
          key: Date.now()
        });
        
        // Play sound based on move type
        if (result.captured) {
          playSound('capture');
          setGameStats(prev => ({ ...prev, captures: prev.captures + 1 }));
        } else {
          playSound('move');
        }
        
        // Update game state after animation completes
        setTimeout(() => {
          setGame(newGame);
          setBoard(newGame.board());
          setHistory(newGame.history({ verbose: true }));
          setLastMove({ from: selected, to: square });
          setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
          updateCapturedPieces();
          setAnimatingPiece(null);
        }, 300);
      } else {
        // Invalid move
        setSelected(null);
        setHighlightSquares([]);
      }
      setSelected(null);
      setHighlightSquares([]);
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({ square, verbose: true });
        const targets = moves.map((m) => m.to);
        setHighlightSquares(targets);
      }
    }
  };

  const updateCapturedPieces = () => {
    const captured = { w: [], b: [] };
    gameRef.current.history({ verbose: true }).forEach(move => {
      if (move.captured) {
        const color = move.color === 'w' ? 'b' : 'w';
        captured[color].push(move.captured);
      }
    });
    setCapturedPieces(captured);
  };

  const handlePromotion = (piece) => {
    playSound('promote');
    
    const newGame = new Chess(game.fen());
    const result = newGame.move({
      from: promotionMove.from,
      to: promotionMove.to,
      promotion: piece,
    });
    
    if (result) {
      playSound('move');
      setGame(newGame);
      setBoard(newGame.board());
      setHistory(newGame.history({ verbose: true }));
      setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
      setLastMove({ from: promotionMove.from, to: promotionMove.to });
      updateCapturedPieces();
    }
    
    setPromotionMove(null);
  };

  const makeAiMove = () => {
    setAiThinking(true);
    
    // Simulate AI thinking time based on difficulty
    const thinkTimes = { easy: 800, medium: 1200, hard: 1800 };
    const thinkTime = thinkTimes[difficulty] || 1000;
    
    setTimeout(() => {
      const moves = game.moves({ verbose: true });
      
      if (moves.length > 0) {
        let move;
        
        // Simple difficulty-based move selection
        if (difficulty === 'easy') {
          // Filter out bad moves
          const reasonableMoves = moves.filter(m => !m.san.includes('??'));
          move = reasonableMoves[Math.floor(Math.random() * reasonableMoves.length)] || moves[0];
        } 
        else if (difficulty === 'hard') {
          // Try to find best moves
          const bestMoves = moves.filter(m => m.san.includes('!') || m.san.includes('+'));
          move = bestMoves[0] || moves[Math.floor(Math.random() * moves.length)];
        }
        else { // medium
          move = moves[Math.floor(Math.random() * moves.length)];
        }
        
        const newGame = new Chess(game.fen());
        const result = newGame.move(move);
        
        if (result) {
          // Set animating piece for AI move
          setAnimatingPiece({
            from: move.from,
            to: move.to,
            piece: symbols[result.piece][result.color],
            key: Date.now()
          });
          
          // Play sound based on move type
          if (result.captured) {
            playSound('capture');
            setGameStats(prev => ({ ...prev, captures: prev.captures + 1 }));
          } else {
            playSound('move');
          }
          
          // Update game state after animation completes
          setTimeout(() => {
            setGame(newGame);
            setBoard(newGame.board());
            setHistory(newGame.history({ verbose: true }));
            setLastMove({ from: move.from, to: move.to });
            setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
            updateCapturedPieces();
            setAiThinking(false);
            setAnimatingPiece(null);
          }, 300);
        } else {
          setAiThinking(false);
        }
      } else {
        setAiThinking(false);
      }
    }, thinkTime);
  };

  const handleUndo = () => {
    if (aiThinking || history.length === 0) return;
    
    playSound('click');
    
    const newGame = new Chess(game.fen());
    newGame.undo();
    setGame(newGame);
    setBoard(newGame.board());
    setHistory(newGame.history({ verbose: true }));
    setSelected(null);
    setHighlightSquares([]);
    setGameStats(prev => ({ ...prev, moves: prev.moves - 1 }));
    updateCapturedPieces();
  };

  const handleReset = () => {
    playSound('click');
    
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setHistory([]);
    setSelected(null);
    setHighlightSquares([]);
    setStatus(`${newGame.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    setPromotionMove(null);
    setCapturedPieces({ w: [], b: [] });
    setLastMove({ from: null, to: null });
    setGameStats({ moves: 0, checks: 0, captures: 0 });
  };

  const symbols = {
    p: { w: "♙", b: "♟" },
    r: { w: "♖", b: "♜" },
    n: { w: "♘", b: "♞" },
    b: { w: "♗", b: "♝" },
    q: { w: "♕", b: "♛" },
    k: { w: "♔", b: "♚" },
  };

  const getFileLabel = (col) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return files[col];
  };

  const getRankLabel = (row) => {
    return 8 - row;
  };

  return (
    <div style={styles.container}>
      <div style={styles.gameContainer}>
        <div style={styles.infoPanel}>
          <div style={styles.gameStatus}>
            <div style={styles.statusHeader}>Game Status</div>
            <div style={styles.statusContent}>
              <div style={styles.statusText}>{status}</div>
              {!game.isGameOver() && (
                <div style={styles.turnIndicator}>
                  {gameMode === 'ai' 
                    ? (game.turn() === 'w' ? 'Your turn (White)' : 'AI thinking...') 
                    : (game.turn() === 'w' ? 'White\'s turn' : 'Black\'s turn')
                  }
                </div>
              )}
            </div>
          </div>

          <div style={styles.gameStats}>
            <div style={styles.statsHeader}>Game Statistics</div>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Moves</div>
                <div style={styles.statValue}>{gameStats.moves}</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Checks</div>
                <div style={styles.statValue}>{gameStats.checks}</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Captures</div>
                <div style={styles.statValue}>{gameStats.captures}</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Difficulty</div>
                <div style={styles.statValue}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
              </div>
            </div>
          </div>

          <div style={styles.capturedContainer}>
            <div style={styles.captured}>
              <h4 style={styles.capturedTitle}>White Captured:</h4>
              <div style={styles.capturedPieces}>
                {capturedPieces.b.map((piece, i) => (
                  <span key={i} style={styles.capturedPiece}>
                    {symbols[piece]['b']}
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.captured}>
              <h4 style={styles.capturedTitle}>Black Captured:</h4>
              <div style={styles.capturedPieces}>
                {capturedPieces.w.map((piece, i) => (
                  <span key={i} style={styles.capturedPiece}>
                    {symbols[piece]['w']}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.boardContainer}>
          <div style={styles.coordinateToggle} onClick={() => {
            playSound('click');
            setShowCoordinates(!showCoordinates);
          }}>
            {showCoordinates ? 'Hide Coordinates' : 'Show Coordinates'}
          </div>
          <div style={styles.board}>
            {board.map((row, rowIndex) =>
              row.map((square, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const piece = square ? square.type : null;
                const color = square ? square.color : null;
                const symbol = piece ? symbols[piece][color] : "";
                const squareName = getSquareName(rowIndex, colIndex);
                const isHighlighted = highlightSquares.includes(squareName);
                const isInCheck = game.isCheck() && 
                  square && 
                  square.type === 'k' && 
                  square.color === game.turn();
                const isLastMove = squareName === lastMove.from || squareName === lastMove.to;
                const isAnimating = animatingPiece && animatingPiece.to === squareName;
                
                return (
                  <Square
                    key={`${rowIndex}-${colIndex}`}
                    dark={isDark}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    selected={selected === squareName}
                    highlight={isHighlighted}
                    check={isInCheck}
                    lastMove={isLastMove}
                    showCoordinates={showCoordinates}
                    fileLabel={getFileLabel(colIndex)}
                    rankLabel={getRankLabel(rowIndex)}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                  >
                    {isAnimating ? (
                      <AnimatedPiece 
                        symbol={animatingPiece.piece} 
                        isMoving={true}
                      />
                    ) : piece ? (
                      <div style={styles.pieceContainer}>
                        {symbol}
                      </div>
                    ) : null}
                  </Square>
                );
              })
            )}
          </div>
        </div>

        <div style={styles.controlsContainer}>
          <div style={styles.controls}>
            <button onClick={onBack} style={styles.backButton}>
              ← Back to Menu
            </button>
            <button onClick={handleUndo} disabled={history.length === 0 || aiThinking} style={styles.controlButton}>
              Undo Move
            </button>
            <button onClick={handleReset} disabled={aiThinking} style={styles.controlButton}>
              New Game
            </button>
          </div>

          <div style={styles.history}>
            <h3 style={styles.historyTitle}>Move History</h3>
            <div style={styles.historyList}>
              {history.map((move, index) => (
                <div key={index} style={styles.historyItem}>
                  {index % 2 === 0 ? <span style={styles.moveNumber}>{Math.floor(index / 2 + 1)}.</span> : ''}
                  <span style={styles.moveText}>{move.san}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {promotionMove && (
        <div style={styles.promotionOverlay}>
          <div style={styles.promotionBox}>
            <div style={styles.promotionTitle}>Promote Your Pawn</div>
            <div style={styles.promotionOptions}>
              {['q', 'r', 'b', 'n'].map(piece => (
                <div 
                  key={piece}
                  style={styles.promotionPiece}
                  onClick={() => handlePromotion(piece)}
                >
                  {symbols[piece][game.turn()]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aiThinking && <Loading difficulty={difficulty} />}
    </div>
  );
};

// ... (styles remain the same as in previous Chessboard.js)

const styles = {
  container: {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '20px',
  },
  gameContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '20px',
  },
  infoPanel: {
    flex: '1',
    minWidth: '300px',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  boardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  coordinateToggle: {
    padding: '8px 15px',
    background: 'rgba(40, 45, 60, 0.7)',
    color: '#fff',
    borderRadius: '20px',
    marginBottom: '15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(50, 55, 70, 0.9)',
    }
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 70px)",
    gridTemplateRows: "repeat(8, 70px)",
    border: "4px solid #2c3e50",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
  },
  controlsContainer: {
    flex: '1',
    minWidth: '300px',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  gameStatus: {
    background: 'rgba(25, 30, 45, 0.8)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  },
  statusHeader: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#769656',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    paddingBottom: '10px',
  },
  statusContent: {
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  turnIndicator: {
    fontSize: '1.2rem',
    color: '#b5d8a8',
    background: 'rgba(118, 150, 86, 0.25)',
    padding: '10px 18px',
    borderRadius: '25px',
    display: 'inline-block',
  },
  gameStats: {
    background: 'rgba(25, 30, 45, 0.8)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  },
  statsHeader: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#769656',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    paddingBottom: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  statItem: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#aaa',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  capturedContainer: {
    background: 'rgba(25, 30, 45, 0.8)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  },
  captured: {
    marginBottom: '25px',
    ':last-child': {
      marginBottom: '0',
    }
  },
  capturedTitle: {
    fontSize: '1.2rem',
    margin: '0 0 12px 0',
    color: '#fff',
    fontWeight: '600',
  },
  capturedPieces: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    minHeight: '50px',
    background: 'rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
    padding: '12px',
  },
  capturedPiece: {
    fontSize: '30px',
    display: 'inline-block',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  },
  controls: {
    background: 'rgba(25, 30, 45, 0.8)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  backButton: {
    padding: '14px 20px',
    background: 'linear-gradient(45deg, #6c757d, #5a6268)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'linear-gradient(45deg, #5a6268, #4a5257)',
    },
  },
  controlButton: {
    padding: '14px 20px',
    background: 'linear-gradient(45deg, #769656, #5a7d3a)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'linear-gradient(45deg, #5a7d3a, #48682f)',
    },
    ':disabled': {
      background: 'linear-gradient(45deg, #3a4a2a, #2d3a20)',
      cursor: 'not-allowed',
      opacity: '0.7',
    },
  },
  history: {
    background: 'rgba(25, 30, 45, 0.8)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  historyTitle: {
    fontSize: '1.4rem',
    margin: '0 0 15px 0',
    color: '#fff',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    paddingBottom: '10px',
  },
  historyList: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  historyItem: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '10px 15px',
    fontSize: '1rem',
    alignItems: 'center',
  },
  moveNumber: {
    fontWeight: '700',
    color: '#769656',
    marginRight: '10px',
    minWidth: '30px',
  },
  moveText: {
    color: '#eee',
    fontWeight: '500',
  },
  promotionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  promotionBox: {
    background: 'linear-gradient(145deg, #2c3e50, #1a2530)',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    minWidth: '350px',
  },
  promotionTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#fff',
  },
  promotionOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '25px',
  },
  promotionPiece: {
    fontSize: '70px',
    cursor: 'pointer',
    padding: '20px',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.12)',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(118, 150, 86, 0.4)',
      transform: 'scale(1.15)',
      boxShadow: '0 0 25px rgba(118, 150, 86, 0.7)',
    }
  },
};

export default Chessboard;