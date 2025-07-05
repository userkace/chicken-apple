/**
 * Chicken Apple Game - A two-player tile matching game
 * Players take turns clicking tiles to reveal their type (chicken or apple)
 * Last player to reveal their type wins the round
 */

import React, { useState } from 'react';
import './App.css';
import chickenImg from './assets/chicken.webp';
import appleImg from './assets/apple.webp';
import { FaSync } from 'react-icons/fa';

/**
 * Tile type definition
 * @typedef {Object} Tile
 * @property {string} type - 'chicken' or 'apple'
 * @property {string} img - Image source URL
 */

/**
 * Game constants
 */
const TILE_COUNT = 36;
const CHICKEN_IMG = chickenImg;
const APPLE_IMG = appleImg;
const TILE_SIZE = 100;
const GRID_COLUMNS = 6;

/**
 * Generate shuffled tiles array
 * @returns {Tile[]} Array of shuffled tiles
 */
function getShuffledTiles() {
  const tiles = [
    ...Array(18).fill({ type: 'chicken', img: CHICKEN_IMG }),
    ...Array(18).fill({ type: 'apple', img: APPLE_IMG })
  ];

  // Fisher-Yates shuffle algorithm
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

/**
 * Main App component
 * @returns {JSX.Element}
 */
function App() {
  const [tiles, setTiles] = useState(getShuffledTiles());
  const [revealed, setRevealed] = useState(Array(TILE_COUNT).fill(false));
  const [playerType, setPlayerType] = useState(null); // null, 'chicken', or 'apple'
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lose, setLose] = useState(false);

  /**
   * Get remaining tiles count for a player
   * @param {string} type - 'chicken' or 'apple'
   * @returns {number}
   */
  const getRemainingTiles = (type) => {
    return tiles.filter((tile, i) => tile.type === type && !revealed[i]).length;
  };

  // For win check
  const playerLeft = playerType ? getRemainingTiles(playerType) : null;

  /**
   * Get the current player's image
   * @returns {string} Image source URL
   */
  const getCurrentPlayerImage = () => {
    return playerType === 'chicken' ? CHICKEN_IMG : APPLE_IMG;
  };

  /**
   * Handle tile click event
   * @param {number} index - Tile index
   */
  const handleTileClick = (index) => {
    if (revealed[index] || gameOver || !playerType) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (tiles[index].type === playerType) {
      setScore((prev) => prev + 1);
      // Check win condition
      if (getRemainingTiles(playerType) - 1 === 0) {
        setGameOver(true);
        setLose(false);
      }
    } else {
      setGameOver(true);
      setLose(true);
    }
  };



  /**
   * Reset the game state
   */
  const handleRestart = () => {
    setTiles(getShuffledTiles());
    setRevealed(Array(TILE_COUNT).fill(false));
    setPlayerType(null);
    setScore(0);
    setGameOver(false);
    setLose(false);
  };



  return (
    <div className="container">
      {/* Choose type screen */}
      {!playerType ? (
        <div className="choose-type-screen">
          <h2>Choose your team</h2>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
            <button className="grid-tile" style={{ width: 120, height: 120 }} onClick={() => setPlayerType('chicken')}>
              <img src={CHICKEN_IMG} alt="Chicken" style={{ width: '90%', height: '90%' }} />
              <div>Chicken</div>
            </button>
            <button className="grid-tile" style={{ width: 120, height: 120 }} onClick={() => setPlayerType('apple')}>
              <img src={APPLE_IMG} alt="Apple" style={{ width: '90%', height: '90%' }} />
              <div>Apple</div>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Info section */}
          <div className="info-section">
            <div className="score-display">
              <h3 className="section-title">Your Score</h3>
              <div className="score-items">
                <div className="score-item">
                  <span className={`score-${playerType}`}>{playerType.charAt(0).toUpperCase() + playerType.slice(1)}</span>
                  <span className="score-value">{score}</span>
                </div>
              </div>
            </div>

            <div className="game-status">
              <h3 className="section-title">Game Status</h3>
              <div className="game-status-content">
                {gameOver ? (
                  lose ? (
                    <div className="winner-message" style={{background:'#fffbe6', borderColor:'#ffe066'}}>
                      <img
                        src={playerType === 'chicken' ? APPLE_IMG : CHICKEN_IMG}
                        alt=""
                        className="player-icon"
                        aria-hidden="true"
                      />
                      <span style={{ color: '#b59f3b' }}>You Lose!</span>
                    </div>
                  ) : (
                    <div className="winner-message">
                      <img
                        src={playerType === 'chicken' ? CHICKEN_IMG : APPLE_IMG}
                        alt=""
                        className="player-icon"
                        aria-hidden="true"
                      />
                      <span style={{ color: 'green' }}>You Win!</span>
                    </div>
                  )
                ) : (
                  <div className="current-player">
                    <img
                      src={playerType === 'chicken' ? CHICKEN_IMG : APPLE_IMG}
                      alt=""
                      className="player-icon"
                      aria-hidden="true"
                    />
                    <span>Find all your {playerType === 'chicken' ? 'Chickens' : 'Apples'}!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Game section */}
          <div className="game-section">
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${TILE_SIZE}px)`,
              gap: '8px',
              justifyContent: 'center'
            }}>
              {tiles.map((tile, idx) => {
                // Show yellow and reveal all on loss
                const yellowLose = gameOver && lose && !revealed[idx];
                return (
                  <button
                    key={idx}
                    className={`grid-tile${yellowLose ? ' grid-tile-yellow' : ''}`}
                    style={{
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      background: revealed[idx] ? '#f0f0f0' : yellowLose ? undefined : '#ddd',
                      border: revealed[idx] ? '2px solid #aaa' : yellowLose ? undefined : '2px solid #aaa',
                      cursor: gameOver || revealed[idx] ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                    onClick={() => handleTileClick(idx)}
                    disabled={gameOver || revealed[idx]}
                  >
                    {(revealed[idx] || yellowLose) ? (
                      <img src={tile.img} alt={tile.type} style={{ width: '90%', height: '90%', opacity: yellowLose && !revealed[idx] ? 0.7 : 1 }} />
                    ) : (
                      <span style={{ fontSize: 18 }}>{idx + 1}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              className="restart-button"
              onClick={handleRestart}
            >
              <FaSync className="restart-icon" /> Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;