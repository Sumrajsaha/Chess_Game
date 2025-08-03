import { useState } from 'react';
import Chessboard from "./components/Chessboard";
import GameMode from "./components/GameMode";

function App() {
  const [gameSettings, setGameSettings] = useState(null);
  
  return (
    <div className="App" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c)',
      padding: '20px',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <header style={{
        padding: '20px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'linear-gradient(45deg, #ff8a00, #e52e71)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          margin: '0',
          letterSpacing: '2px'
        }}>♛ GRANDMASTER CHESS ♛</h1>
        <p style={{
          fontSize: '1.3rem',
          opacity: '0.9',
          maxWidth: '600px',
          margin: '15px auto',
          lineHeight: '1.6',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>The ultimate chess experience with realistic gameplay</p>
      </header>
      
      {gameSettings ? (
        <Chessboard 
          gameMode={gameSettings.mode} 
          difficulty={gameSettings.difficulty}
          onBack={() => setGameSettings(null)} 
        />
      ) : (
        <GameMode onSelect={(mode, difficulty) => setGameSettings({ mode, difficulty })} />
      )}
      
      <footer style={{
        marginTop: '50px',
        padding: '20px',
        textAlign: 'center',
        fontSize: '1rem',
        opacity: '0.8',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}>
        <p>© {new Date().getFullYear()} Grandmaster Chess • Made with React and chess.js</p>
      </footer>
    </div>
  );
}

export default App;