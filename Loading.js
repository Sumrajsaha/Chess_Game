import React, { useEffect, useState } from "react";

const Loading = ({ difficulty }) => {
  const difficultyText = {
    easy: "Novice AI is thinking...",
    medium: "Intermediate AI is thinking...",
    hard: "Expert AI is thinking..."
  };
  
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
        <div style={styles.spinnerInner}></div>
        <div style={styles.spinnerCore}></div>
      </div>
      <p style={styles.text}>{difficultyText[difficulty] || "AI is thinking"}{'.'.repeat(dots)}</p>
      <p style={styles.hint}>Calculating the best move...</p>
    </div>
  );
};

// ... (styles remain the same as in previous Loading.js)

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
  },
  spinnerContainer: {
    position: 'relative',
    width: '120px',
    height: '120px',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '6px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    borderTop: '6px solid #769656',
    animation: 'spin 1.8s linear infinite',
  },
  spinnerInner: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    width: '90px',
    height: '90px',
    border: '5px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    borderTop: '5px solid #b5d8a8',
    animation: 'spin 1.2s linear infinite reverse',
  },
  spinnerCore: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    borderTop: '4px solid #e6f5d0',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    marginTop: '30px',
    fontSize: '1.4rem',
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '400px',
  },
  hint: {
    marginTop: '10px',
    fontSize: '1rem',
    color: '#aaa',
    fontStyle: 'italic',
  },
};

// Add CSS animation
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleTag);

export default Loading;