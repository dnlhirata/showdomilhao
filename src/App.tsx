import { useState } from "react";
import "./App.css";
import CardSelection from "./components/CardSelection";
import { PrizeTracker } from "./components/PrizeTracker";
import QuestionCard from "./components/QuestionCard";
import { useGameState } from "./hooks/useGameState";

function App() {
  // Real game state from useGameState hook
  const {
    gameState,
    prizes,
    answerQuestion,
    skipQuestion,
    useUniversityHelp: triggerUniversityHelp,
    useCardsHelp: triggerCardsHelp,
    resetGame,
    getCurrentPrize,
  } = useGameState();

  // UI state for answer feedback and help displays
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [showNoiaHelp, setShowNoiaHelp] = useState(false);

  // Handle answer selection with visual feedback
  const handleAnswer = (optionIndex: number) => {
    if (gameState.gameOver || showResult) return;

    setSelectedOption(optionIndex);
    setShowResult(true);

    // Show result for 2 seconds before progressing
    setTimeout(() => {
      answerQuestion(optionIndex);
      setSelectedOption(null);
      setShowResult(false);
    }, 2000);
  };

  // Handle skip with UI cleanup
  const handleSkip = () => {
    skipQuestion();
    setSelectedOption(null);
    setShowResult(false);
  };

  // Handle university help - shows percentage bars
  const handleUniversityHelp = () => {
    if (gameState.universitiesUsed) return;
    setShowNoiaHelp(true);
    // Mark as used in the game state
    triggerUniversityHelp();
  };

  // Handle closing nóia help modal
  const handleCloseNoiaHelp = () => {
    setShowNoiaHelp(false);
  };

  // Handle cards help button click - show card selection
  const handleCardsHelpClick = () => {
    setShowCardSelection(true);
  };

  // Handle card selection from the modal
  const handleCardSelect = (cardValue: number) => {
    if (cardValue > 0) {
      triggerCardsHelp(cardValue as 1 | 2 | 3);
    }
    // Close the modal after selection
    setTimeout(() => {
      setShowCardSelection(false);
    }, 1000);
  };

  // Handle closing card selection modal
  const handleCloseCardSelection = () => {
    setShowCardSelection(false);
  };

  // Handle play again with UI cleanup
  const handlePlayAgain = () => {
    resetGame();
    setSelectedOption(null);
    setShowResult(false);
    setShowCardSelection(false);
    setShowNoiaHelp(false);
  };

  const formatPrize = (prize: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(prize);
  };

  // Game Over Screen
  if (gameState.gameOver) {
    return (
      <div className="app">
        <div className="game-over-screen">
          <h1>
            {gameState.won ? "🎉 PARABÉNS! VOCÊ GANHOU!" : "😢 GAME OVER"}
          </h1>
          <div className="final-score">
            <h2>Pontuação Final: {gameState.score}/15</h2>
            <h3>Prêmio: {formatPrize(getCurrentPrize())}</h3>
            {gameState.won && (
              <p>Você completou todas as perguntas e ganhou o prêmio máximo!</p>
            )}
            {!gameState.won && <p>Resposta incorreta! Tente novamente.</p>}
          </div>
          <button className="play-again-btn" onClick={handlePlayAgain}>
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen (when no current question)
  if (!gameState.currentQuestion) {
    return (
      <div className="app">
        <div className="loading-screen">
          <h1>Show do Milhão</h1>
          <p>Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="app">
      <header className="game-header">
        <h1>Show do Milhão</h1>
      </header>

      <main className="game-main">
        {/* Question Area */}
        <div className="question-area">
          <QuestionCard
            question={gameState.currentQuestion}
            onAnswer={handleAnswer}
            hiddenOptions={gameState.hiddenOptions}
            disabled={showResult}
            selectedOption={
              selectedOption !== null ? selectedOption : undefined
            }
            showResult={showResult}
            isCorrect={
              selectedOption !== null &&
              selectedOption === gameState.currentQuestion.correct
            }
          />
        </div>

        {/* Prize Tracker - Embaixo das perguntas */}
        <PrizeTracker
          prizes={prizes}
          currentScore={gameState.score}
          gameOver={gameState.gameOver}
          won={gameState.won}
        />

        {/* Botões de Ajuda */}
        <div className="help-buttons">
          <button
            className={`help-btn skip-btn ${
              gameState.skipsLeft === 0 ? "disabled" : ""
            }`}
            onClick={handleSkip}
            disabled={gameState.skipsLeft === 0 || showResult}
          >
            ⏭️ Pular ({gameState.skipsLeft})
          </button>

          <button
            className={`help-btn university-btn ${
              gameState.universitiesUsed ? "disabled" : ""
            }`}
            onClick={handleUniversityHelp}
            disabled={gameState.universitiesUsed || showResult}
          >
            Ajuda dos nóia
          </button>

          <button
            className={`help-btn cards-btn ${
              gameState.cardsUsed ? "disabled" : ""
            }`}
            onClick={handleCardsHelpClick}
            disabled={gameState.cardsUsed || showResult}
          >
            🃏 Cartas
          </button>
        </div>
      </main>

      {/* Card Selection Modal */}
      {showCardSelection && (
        <CardSelection
          onCardSelect={handleCardSelect}
          onClose={handleCloseCardSelection}
          disabled={showResult}
        />
      )}

      {/* Nóia Help Modal */}
      {showNoiaHelp && (
        <div className="noia-help-overlay" onClick={handleCloseNoiaHelp}>
          <div className="noia-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="noia-help-content">
              <h2>Nóias, unam-se</h2>
              <img src="/noias.jpg" alt="Nóias" className="noias-image" />
              <button className="dismiss-btn" onClick={handleCloseNoiaHelp}>
                Dispensar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
