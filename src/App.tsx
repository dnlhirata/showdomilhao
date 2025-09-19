import { useState } from "react";
import "./App.css";

import QuestionCard from "./components/QuestionCard";
import type { Question, UniversityHelpResult } from "./types";

function App() {
  // Mock game state - no real logic, just UI state
  const [currentView, setCurrentView] = useState<
    "game" | "gameOver" | "loading"
  >("game");
  const [universityResult, setUniversityResult] =
    useState<UniversityHelpResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Mock game data
  const mockQuestion: Question = {
    id: 1,
    question: "Qual é a capital do Brasil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    correct: 2,
    level: "easy",
  };

  const mockGameState = {
    currentQuestionIndex: 0,
    score: 0,
    skipsLeft: 3,
    universitiesUsed: false,
    cardsUsed: false,
    gameOver: false,
    won: false,
    hiddenOptions: [] as number[],
  };

  // Mock methods - no real functionality, just UI feedback
  const handleAnswer = (optionIndex: number) => {
    console.log(`Mock: Selected option ${optionIndex}`);
    setSelectedOption(optionIndex);
    setShowResult(true);

    // Mock delay to show result
    setTimeout(() => {
      setSelectedOption(null);
      setShowResult(false);
      setUniversityResult(null);
    }, 2000);
  };

  const handleSkip = () => {
    console.log("Mock: Skip question");
    setUniversityResult(null);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleUniversityHelp = () => {
    console.log("Mock: University help");
    // Mock university result
    const mockResult: UniversityHelpResult = {
      percentages: [15, 25, 45, 15], // Mock percentages favoring option C
    };
    setUniversityResult(mockResult);
  };

  const handleCardsHelp = (cardValue: 1 | 2 | 3) => {
    console.log(`Mock: Cards help - eliminate ${cardValue} options`);
  };

  const handlePlayAgain = () => {
    console.log("Mock: Play again");
    setCurrentView("game");
    setUniversityResult(null);
    setSelectedOption(null);
    setShowResult(false);
  };

  const formatPrize = (prize: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(prize);
  };

  // Mock prizes
  const getCurrentPrize = () => 1000;
  const getNextPrize = () => 2000;

  // Game Over Screen (Mock)
  if (currentView === "gameOver") {
    return (
      <div className="app">
        <div className="game-over-screen">
          <h1>🎉 PARABÉNS! VOCÊ GANHOU!</h1>
          <div className="final-score">
            <h2>Pontuação Final: 5/15</h2>
            <h3>Prêmio: {formatPrize(5000)}</h3>
          </div>
          <button className="play-again-btn" onClick={handlePlayAgain}>
            Jogar Novamente
          </button>
          <button
            className="demo-btn"
            onClick={() => setCurrentView("game")}
            style={{ marginTop: "1rem", background: "#666" }}
          >
            Voltar para Demo
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen (Mock)
  if (currentView === "loading") {
    return (
      <div className="app">
        <div className="loading-screen">
          <h1>Show do Milhão</h1>
          <p>Carregando perguntas...</p>
          <button
            className="demo-btn"
            onClick={() => setCurrentView("game")}
            style={{ marginTop: "2rem" }}
          >
            Ir para Demo
          </button>
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
            <span>Pergunta: {mockGameState.currentQuestionIndex + 1}/15</span>
            <span>Prêmio Atual: {formatPrize(getCurrentPrize())}</span>
            <span>Próximo Prêmio: {formatPrize(getNextPrize())}</span>
          </div>
        </div>
      </header>

      <main className="game-main">
        <QuestionCard
          question={mockQuestion}
          onAnswer={handleAnswer}
          hiddenOptions={mockGameState.hiddenOptions}
          disabled={showResult}
          selectedOption={selectedOption || undefined}
          showResult={showResult}
          isCorrect={selectedOption === mockQuestion.correct}
        />

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
              mockGameState.skipsLeft === 0 ? "disabled" : ""
            }`}
            onClick={handleSkip}
            disabled={mockGameState.skipsLeft === 0 || showResult}
          >
            ⏭️ Pular ({mockGameState.skipsLeft})
          </button>

          <button
            className={`help-btn university-btn ${
              mockGameState.universitiesUsed ? "disabled" : ""
            }`}
            onClick={handleUniversityHelp}
            disabled={mockGameState.universitiesUsed || showResult}
          >
            🎓 Universitários
          </button>

          <div className="cards-help">
            <span
              className={`help-label ${
                mockGameState.cardsUsed ? "disabled" : ""
              }`}
            >
              🃏 Cartas:
            </span>
            <button
              className={`help-btn card-btn ${
                mockGameState.cardsUsed ? "disabled" : ""
              }`}
              onClick={() => handleCardsHelp(1)}
              disabled={mockGameState.cardsUsed || showResult}
            >
              1
            </button>
            <button
              className={`help-btn card-btn ${
                mockGameState.cardsUsed ? "disabled" : ""
              }`}
              onClick={() => handleCardsHelp(2)}
              disabled={mockGameState.cardsUsed || showResult}
            >
              2
            </button>
            <button
              className={`help-btn card-btn ${
                mockGameState.cardsUsed ? "disabled" : ""
              }`}
              onClick={() => handleCardsHelp(3)}
              disabled={mockGameState.cardsUsed || showResult}
            >
              3
            </button>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="demo-controls">
          <h4>🎮 Demo Controls:</h4>
          <div className="demo-buttons">
            <button onClick={() => setCurrentView("loading")}>
              Loading Screen
            </button>
            <button onClick={() => setCurrentView("gameOver")}>
              Game Over Screen
            </button>
            <button onClick={handleUniversityHelp}>Show University Help</button>
            <button onClick={() => setUniversityResult(null)}>
              Hide University Help
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
