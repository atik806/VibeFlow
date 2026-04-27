import { useState } from 'react'
import { Gamepad2, Zap, Trophy, RotateCcw } from '../../icons'
import { useSEO } from '../../hooks/useSEO'

const games = [
  {
    id: 'word-guess',
    name: 'Word Guess',
    description: 'AI thinks of a word, you guess it with clues',
    icon: '🎯',
    color: '#ec4899',
  },
  {
    id: 'trivia',
    name: 'AI Trivia',
    description: 'Test your knowledge against AI-generated questions',
    icon: '🧠',
    color: '#8b5cf6',
  },
  {
    id: 'rps',
    name: 'Rock Paper Scissors',
    description: 'Challenge AI in the classic game',
    icon: '✋',
    color: '#06b6d4',
  },
]

export function Games() {
  useSEO({
    title: 'AI Games',
    description: 'Play interactive AI-powered games.',
  })

  const [activeGame, setActiveGame] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [score, setScore] = useState({ wins: 0, losses: 0, ties: 0 })
  const [feedback, setFeedback] = useState('')

  const startGame = (gameId) => {
    setActiveGame(gameId)
    setGameState({ question: '', guesses: [], attempts: 0, maxAttempts: gameId === 'word-guess' ? 6 : 10 })
    setFeedback('')
  }

  const exitGame = () => {
    setActiveGame(null)
    setGameState(null)
    setFeedback('')
  }

  const handleGuess = (value) => {
    if (!gameState) return
    
    if (activeGame === 'word-guess') {
      const correct = value.toLowerCase() === 'mystery'
      const newGuesses = [...gameState.guesses, value]
      const newAttempts = gameState.attempts + 1
      
      if (correct) {
        setFeedback('Correct! You got it!')
        setScore(s => ({ ...s, wins: s.wins + 1 }))
      } else if (newAttempts >= gameState.maxAttempts) {
        setFeedback(`Game Over! The word was "mystery"`)
        setScore(s => ({ ...s, losses: s.losses + 1 }))
      } else {
        setFeedback(`Hint: The word has ${value.length} letters`)
      }
      
      setGameState({ ...gameState, guesses: newGuesses, attempts: newAttempts })
    }
  }

  const handleRPS = (choice) => {
    const options = ['rock', 'paper', 'scissors']
    const aiChoice = options[Math.floor(Math.random() * 3)]
    
    let result = 'tie'
    if (
      (choice === 'rock' && aiChoice === 'scissors') ||
      (choice === 'paper' && aiChoice === 'rock') ||
      (choice === 'scissors' && aiChoice === 'paper')
    ) {
      result = 'win'
      setScore(s => ({ ...s, wins: s.wins + 1 }))
      setFeedback(`You ${choice} vs AI ${aiChoice}. You win!`)
    } else if (result !== 'tie') {
      setScore(s => ({ ...s, losses: s.losses + 1 }))
      setFeedback(`You ${choice} vs AI ${aiChoice}. You lose!`)
    } else {
      setFeedback(`You ${choice} vs AI ${aiChoice}. It's a tie!`)
    }
  }

  if (!activeGame) {
    return (
      <div className="games-section">

        <div className="games-grid">
          {games.map((game) => (
            <button key={game.id} className="game-card" onClick={() => startGame(game.id)}>
              <span className="game-icon">{game.icon}</span>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </button>
          ))}
        </div>

        <div className="games-score">
          <Trophy size={20} />
          <span>Wins: {score.wins}</span>
          <span>Losses: {score.losses}</span>
          <span>Ties: {score.ties}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="games-section">
      <div className="games-header">
        <button className="games-back-btn" onClick={exitGame}>
          <RotateCcw size={20} />
          Back to Games
        </button>
        <h2>
          <span className="game-icon">{games.find(g => g.id === activeGame)?.icon}</span>
          {games.find(g => g.id === activeGame)?.name}
        </h2>
      </div>

      {activeGame === 'rps' && (
        <div className="rps-game">
          <p className="rps-instruction">Choose your move:</p>
          <div className="rps-buttons">
            <button className="rps-btn" onClick={() => handleRPS('rock')}>✊ Rock</button>
            <button className="rps-btn" onClick={() => handleRPS('paper')}>✋ Paper</button>
            <button className="rps-btn" onClick={() => handleRPS('scissors')}>✌️ Scissors</button>
          </div>
        </div>
      )}

      {activeGame === 'word-guess' && (
        <div className="word-guess-game">
          <p className="wg-instruction">Guess the AI's secret word! (Hint: It's a common noun)</p>
          <div className="wg-attempts">
            Attempts: {gameState?.attempts || 0} / {gameState?.maxAttempts}
          </div>
          <div className="wg-guesses">
            {gameState?.guesses.map((g, i) => (
              <span key={i} className="wg-guess">{g}</span>
            ))}
          </div>
          <div className="wg-input">
            <input type="text" placeholder="Enter your guess..." id="wg-input" />
            <button onClick={() => {
              const input = document.getElementById('wg-input')
              if (input?.value) {
                handleGuess(input.value)
                input.value = ''
              }
            }}>Guess</button>
          </div>
        </div>
      )}

      {activeGame === 'trivia' && (
        <div className="trivia-game">
          <p className="trivia-coming-soon">Trivia game coming soon!</p>
          <button className="games-back-btn" onClick={exitGame}>
            <RotateCcw size={20} />
            Back to Games
          </button>
        </div>
      )}

      {feedback && (
        <div className="games-feedback">
          <Zap size={18} />
          {feedback}
        </div>
      )}

      <div className="games-score">
        <Trophy size={20} />
        <span>Wins: {score.wins}</span>
        <span>Losses: {score.losses}</span>
        <span>Ties: {score.ties}</span>
      </div>
    </div>
  )
}