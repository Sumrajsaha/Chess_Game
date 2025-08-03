import React, { useEffect, useRef } from 'react';

const AnimatedPiece = ({ symbol, isMoving, moveFrom, moveTo }) => {
  const pieceRef = useRef(null);
  
  useEffect(() => {
    if (isMoving && pieceRef.current) {
      // Create animation
      pieceRef.current.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(1.2)', opacity: 0.8 },
          { transform: 'scale(1)', opacity: 1 }
        ],
        {
          duration: 300,
          easing: 'ease-out'
        }
      );
    }
  }, [isMoving]);

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

export default AnimatedPiece;