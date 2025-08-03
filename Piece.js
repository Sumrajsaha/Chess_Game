import React, { useEffect, useRef } from "react";

const Piece = ({ symbol }) => {
  const pieceRef = useRef(null);
  
  useEffect(() => {
    if (pieceRef.current) {
      // Create subtle hover animation
      pieceRef.current.animate(
        [
          { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px rgba(255,255,200,0))' },
          { transform: 'scale(1.1)', filter: 'drop-shadow(0 0 8px rgba(255,255,200,0.7))' },
          { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px rgba(255,255,200,0))' }
        ],
        {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
    }
  }, []);

  return (
    <div ref={pieceRef} style={styles.piece}>
      {symbol}
    </div>
  );
};

const styles = {
  piece: {
    fontSize: "52px",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    textShadow: "0 3px 6px rgba(0,0,0,0.4)",
  },
};

export default Piece;