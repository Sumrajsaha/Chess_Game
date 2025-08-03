import React from "react";

const Square = ({ 
  dark, 
  onClick, 
  selected, 
  highlight, 
  check, 
  lastMove,
  showCoordinates,
  fileLabel,
  rankLabel,
  rowIndex,
  colIndex,
  children
}) => {
  let backgroundColor = dark ? "#769656" : "#eeeed2";
  let boxShadow = "none";
  
  if (highlight) {
    backgroundColor = "rgba(155, 199, 0, 0.6)";
    boxShadow = "inset 0 0 15px rgba(255, 255, 100, 0.8)";
  }
  
  if (selected) {
    backgroundColor = "rgba(255, 255, 100, 0.7)";
    boxShadow = "inset 0 0 20px rgba(255, 215, 0, 0.9)";
  }
  
  if (check) {
    backgroundColor = "rgba(255, 100, 100, 0.7)";
    boxShadow = "inset 0 0 20px rgba(255, 0, 0, 0.8)";
  }
  
  if (lastMove) {
    backgroundColor = dark 
      ? "rgba(100, 150, 200, 0.6)" 
      : "rgba(150, 200, 255, 0.6)";
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: "70px",
        height: "70px",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        boxShadow: boxShadow,
        transition: "all 0.2s ease",
      }}
    >
      {children}
      
      {showCoordinates && (
        <>
          {/* File letters (a-h) at the bottom */}
          {rowIndex === 7 && (
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: dark ? '#eeeed2' : '#769656',
              opacity: 0.8
            }}>
              {fileLabel}
            </div>
          )}
          
          {/* Rank numbers (1-8) at the top */}
          {colIndex === 0 && (
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: dark ? '#eeeed2' : '#769656',
              opacity: 0.8
            }}>
              {rankLabel}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Square;