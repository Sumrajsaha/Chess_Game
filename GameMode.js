import React, { useState } from 'react';

const GameMode = ({ onSelect }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Choose Your Battle</h2>
        <p style={styles.subtitle}>Select your preferred challenge</p>
      </div>
      
      <div style={styles.modes}>
        <div 
          style={styles.modeCard} 
          onClick={() => onSelect('friend', selectedDifficulty)}
        >
          <div style={styles.icon}>👥</div>
          <h3 style={styles.modeTitle}>Local Duel</h3>
          <p style={styles.modeDesc}>Challenge a friend on the same device</p>
          <div style={styles.cardFooter}>Pass & Play</div>
        </div>
        
        <div 
          style={styles.modeCard} 
          onClick={() => onSelect('ai', selectedDifficulty)}
        >
          <div style={styles.icon}>🤖</div>
          <h3 style={styles.modeTitle}>AI Challenge</h3>
          <p style={styles.modeDesc}>Test your skills against our chess engine</p>
          <div style={styles.cardFooter}>Smart Opponent</div>
        </div>
      </div>
      
      <div style={styles.difficultySection}>
        <h3 style={styles.difficultyTitle}>Select Difficulty</h3>
        <p style={styles.difficultySubtitle}>Adjust AI strength to your skill level</p>
        <div style={styles.difficultyOptions}>
          {[
            { id: 'easy', name: 'Novice', desc: 'Great for beginners' },
            { id: 'medium', name: 'Intermediate', desc: 'Challenging for casual players' },
            { id: 'hard', name: 'Expert', desc: 'For experienced chess players' }
          ].map(level => (
            <div
              key={level.id}
              style={{
                ...styles.difficultyButton,
                ...(selectedDifficulty === level.id ? styles.selectedDifficulty : {})
              }}
              onClick={() => setSelectedDifficulty(level.id)}
            >
              <div style={styles.difficultyLabel}>{level.name}</div>
              <div style={styles.difficultyDesc}>{level.desc}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.instructions}>
        <h3 style={styles.instructionsTitle}>How to Play</h3>
        <ul style={styles.instructionsList}>
          <li>Click on a piece to select it, then click on a highlighted square to move</li>
          <li>Pawns promote to Queen, Rook, Bishop or Knight when reaching the opposite side</li>
          <li>Checkmate ends the game - protect your king!</li>
          <li>Use Undo Move to take back a move</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px',
    background: 'rgba(15, 20, 35, 0.75)',
    borderRadius: '20px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 10px 0',
    background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: '0.9',
    margin: '0',
  },
  modes: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  modeCard: {
    flex: '1',
    minWidth: '280px',
    maxWidth: '350px',
    background: 'linear-gradient(145deg, rgba(40, 44, 52, 0.85), rgba(30, 33, 41, 0.85))',
    borderRadius: '15px',
    padding: '30px 25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
      background: 'linear-gradient(145deg, rgba(50, 54, 62, 0.95), rgba(40, 43, 51, 0.95))',
    },
  },
  icon: {
    fontSize: '80px',
    marginBottom: '25px',
    textShadow: '0 0 15px rgba(255,255,255,0.4)',
    transition: 'all 0.3s ease',
  },
  modeTitle: {
    fontSize: '1.8rem',
    margin: '0 0 12px 0',
    color: '#fff',
    fontWeight: '600',
  },
  modeDesc: {
    fontSize: '1.1rem',
    opacity: '0.85',
    textAlign: 'center',
    margin: '0 0 25px 0',
    lineHeight: '1.6',
  },
  cardFooter: {
    marginTop: 'auto',
    background: 'rgba(118, 150, 86, 0.3)',
    color: '#c5e8b7',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  difficultySection: {
    background: 'rgba(20, 25, 40, 0.7)',
    borderRadius: '15px',
    padding: '25px 30px',
    marginBottom: '30px',
  },
  difficultyTitle: {
    textAlign: 'center',
    fontSize: '1.6rem',
    margin: '0 0 10px 0',
    color: '#fff',
    fontWeight: '600',
  },
  difficultySubtitle: {
    textAlign: 'center',
    fontSize: '1.1rem',
    opacity: '0.85',
    margin: '0 0 25px 0',
  },
  difficultyOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  difficultyButton: {
    flex: '1',
    minWidth: '220px',
    background: 'rgba(45, 50, 65, 0.7)',
    borderRadius: '15px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    ':hover': {
      background: 'rgba(55, 60, 75, 0.85)',
    },
  },
  selectedDifficulty: {
    background: 'rgba(118, 150, 86, 0.35)',
    borderColor: '#8fbc8f',
    boxShadow: '0 0 20px rgba(118, 150, 86, 0.5)',
  },
  difficultyLabel: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px',
  },
  difficultyDesc: {
    fontSize: '1rem',
    opacity: '0.8',
  },
  instructions: {
    background: 'rgba(25, 30, 45, 0.7)',
    borderRadius: '15px',
    padding: '25px 30px',
  },
  instructionsTitle: {
    fontSize: '1.5rem',
    margin: '0 0 15px 0',
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionsList: {
    fontSize: '1.1rem',
    paddingLeft: '20px',
    lineHeight: '1.7',
    opacity: '0.9',
  },
  instructionsListLi: {
    marginBottom: '10px',
  }
};

export default GameMode;