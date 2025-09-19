import { useState } from "react";
import "./App.css";
import CardSelection from "./components/CardSelection";
import { PrizeTracker } from "./components/PrizeTracker";
import QuestionCard from "./components/QuestionCard";
import { useGameState } from "./hooks/useGameState";
import type { UniversityHelpResult } from "./types";

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
    getNextPrize,
  } = useGameState();

  // UI state for answer feedback and university help display
  const [universityResult, setUniversityResult] =
    useState<UniversityHelpResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCardSelection, setShowCardSelection] = useState(false);

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
      setUniversityResult(null);
    }, 2000);
  };

  // Handle skip with UI cleanup
  const handleSkip = () => {
    skipQuestion();
    setUniversityResult(null);
    setSelectedOption(null);
    setShowResult(false);
  };

  // Handle university help
  const handleUniversityHelp = () => {
    const result = triggerUniversityHelp();
    if (result) {
      setUniversityResult(result);
    }
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
    setUniversityResult(null);
    setSelectedOption(null);
    setShowResult(false);
    setShowCardSelection(false);
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
        <div className="game-info">
          <div className="score-info">
            <span>Pergunta: {gameState.currentQuestionIndex + 1}/15</span>
            <span>Prêmio Atual: {formatPrize(getCurrentPrize())}</span>
            <span>Próximo Prêmio: {formatPrize(getNextPrize())}</span>
          </div>
        </div>
      </header>

      <main className="game-main">
        <div className="game-layout">
          {/* Prize Tracker */}
          <aside className="prize-sidebar">
            <PrizeTracker
              prizes={prizes}
              currentScore={gameState.score}
              gameOver={gameState.gameOver}
              won={gameState.won}
            />
          </aside>

          {/* Question Area */}
          <div className="question-area">
            <QuestionCard
              question={gameState.currentQuestion}
              onAnswer={handleAnswer}
              hiddenOptions={gameState.hiddenOptions}
              disabled={showResult}
              selectedOption={selectedOption || undefined}
              showResult={showResult}
              isCorrect={selectedOption === gameState.currentQuestion.correct}
            />
          </div>
        </div>

        {/* Resultado da Ajuda dos Universitários */}
        {universityResult && (
          <div className="university-help-result">
            <h3>📊 Opinião dos Universitários:</h3>
            <div className="university-percentages">
              {universityResult.percentages.map((percentage, index) => (
                <div key={index} className="percentage-bar">
                  <span className="option-label">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="percentage-value">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            🎓 Universitários
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
    </div>
  );
}

export default App;
