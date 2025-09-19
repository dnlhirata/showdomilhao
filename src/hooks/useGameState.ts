import { useCallback, useEffect, useMemo, useState } from "react";
import questionsData from "../questions/questions.json";
import type {
  CardValue,
  GameState,
  Question,
  QuestionsData,
  UniversityHelpResult,
} from "../types";

/**
 * Hook personalizado para gerenciar o estado do jogo Show do Milhão
 */
export const useGameState = () => {
  // Estado inicial do jogo
  const initialGameState = useMemo<GameState>(
    () => ({
      currentQuestionIndex: 0,
      currentQuestion: null,
      score: 0,
      skipsLeft: 3,
      universitiesUsed: false,
      cardsUsed: false,
      gameOver: false,
      won: false,
      hiddenOptions: [],
    }),
    []
  );

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prizes] = useState<number[]>((questionsData as QuestionsData).prizes);
  const [showWrongAnswerCard, setShowWrongAnswerCard] = useState(false);

  // Carrega as perguntas e embaralha na inicialização
  useEffect(() => {
    const loadedQuestions = (questionsData as QuestionsData).questions;
    // Embaralha as perguntas para cada jogo
    const shuffledQuestions = [...loadedQuestions].sort(
      () => Math.random() - 0.5
    );
    // Pega apenas 15 perguntas para o jogo (5 fáceis, 5 médias, 5 difíceis)
    const easyQuestions = shuffledQuestions
      .filter((q) => q.level === "easy")
      .slice(0, 5);
    const mediumQuestions = shuffledQuestions
      .filter((q) => q.level === "medium")
      .slice(0, 5);
    const hardQuestions = shuffledQuestions
      .filter((q) => q.level === "hard")
      .slice(0, 5);

    const gameQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];
    setQuestions(gameQuestions);

    // Define a primeira pergunta
    if (gameQuestions.length > 0) {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: gameQuestions[0],
      }));
    }
  }, []);

  /**
   * Responde uma pergunta
   */
  const answerQuestion = useCallback(
    (optionIndex: number) => {
      if (gameState.gameOver || !gameState.currentQuestion) return;

      const isCorrect = optionIndex === gameState.currentQuestion.correct;
      const nextIndex = gameState.currentQuestionIndex + 1;

      if (isCorrect) {
        const newScore = gameState.score + 1; // Incrementa apenas quando acerta

        // Verifica se ganhou o jogo (respondeu corretamente 10 perguntas)
        if (newScore >= prizes.length) {
          setGameState((prev) => ({
            ...prev,
            score: newScore,
            gameOver: true,
            won: true,
            currentQuestion: null,
          }));
        } else {
          // Próxima pergunta
          setGameState((prev) => ({
            ...prev,
            currentQuestionIndex: nextIndex,
            currentQuestion: questions[nextIndex],
            score: newScore,
            hiddenOptions: [], // Reset das opções escondidas
          }));
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          gameOver: false,
          won: false,
          currentQuestion: questions[nextIndex],
          currentQuestionIndex: nextIndex,
        }));
        setShowWrongAnswerCard(true);
      }
    },
    [
      gameState.gameOver,
      gameState.currentQuestion,
      gameState.currentQuestionIndex,
      gameState.score,
      questions,
      prizes.length,
      setShowWrongAnswerCard,
    ]
  );

  /**
   * Pula a pergunta atual (máximo 3 vezes)
   */
  const skipQuestion = useCallback(() => {
    if (
      gameState.gameOver ||
      gameState.skipsLeft <= 0 ||
      !gameState.currentQuestion
    )
      return;

    const nextIndex = gameState.currentQuestionIndex + 1;

    // Verifica se ainda há perguntas
    if (nextIndex >= questions.length) {
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        won: false,
        currentQuestion: null,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        currentQuestion: questions[nextIndex],
        skipsLeft: prev.skipsLeft - 1,
        hiddenOptions: [], // Reset das opções escondidas
      }));
    }
  }, [
    gameState.gameOver,
    gameState.skipsLeft,
    gameState.currentQuestion,
    gameState.currentQuestionIndex,
    questions,
  ]);

  /**
   * Usa a ajuda dos universitários (apenas uma vez por jogo)
   */
  const useUniversityHelp = useCallback((): UniversityHelpResult | null => {
    if (
      gameState.gameOver ||
      gameState.universitiesUsed ||
      !gameState.currentQuestion
    ) {
      return null;
    }

    // Simula a porcentagem dos universitários
    // A resposta correta tem maior probabilidade
    const correctIndex = gameState.currentQuestion.correct;
    const percentages = [0, 0, 0, 0];

    // Distribui as porcentagens (resposta correta tem mais chance)
    const correctPercentage = 40 + Math.random() * 30; // 40-70%
    percentages[correctIndex] = Math.round(correctPercentage);

    // Distribui o restante entre as outras opções
    const remaining = 100 - percentages[correctIndex];
    const otherOptions = [0, 1, 2, 3].filter((i) => i !== correctIndex);

    let remainingToDistribute = remaining;
    otherOptions.forEach((index, i) => {
      if (i === otherOptions.length - 1) {
        // Última opção recebe o que sobrou
        percentages[index] = remainingToDistribute;
      } else {
        const percentage = Math.round(
          Math.random() * remainingToDistribute * 0.6
        );
        percentages[index] = percentage;
        remainingToDistribute -= percentage;
      }
    });

    setGameState((prev) => ({
      ...prev,
      universitiesUsed: true,
    }));

    return { percentages };
  }, [
    gameState.gameOver,
    gameState.universitiesUsed,
    gameState.currentQuestion,
  ]);

  /**
   * Usa as cartas (elimina alternativas incorretas)
   */
  const useCardsHelp = useCallback(
    (cardValue: CardValue) => {
      if (
        gameState.gameOver ||
        gameState.cardsUsed ||
        !gameState.currentQuestion
      ) {
        return;
      }

      const correctIndex = gameState.currentQuestion.correct;
      const incorrectOptions = [0, 1, 2, 3].filter((i) => i !== correctIndex);

      // Embaralha as opções incorretas e pega as que serão escondidas
      const shuffledIncorrect = [...incorrectOptions].sort(
        () => Math.random() - 0.5
      );
      const optionsToHide = shuffledIncorrect.slice(0, cardValue);

      setGameState((prev) => ({
        ...prev,
        cardsUsed: true,
        hiddenOptions: optionsToHide,
      }));
    },
    [gameState.gameOver, gameState.cardsUsed, gameState.currentQuestion]
  );

  /**
   * Reinicia o jogo
   */
  const resetGame = useCallback(() => {
    setGameState(initialGameState);

    // Reembaralha as perguntas
    const loadedQuestions = (questionsData as QuestionsData).questions;
    const shuffledQuestions = [...loadedQuestions].sort(
      () => Math.random() - 0.5
    );
    const easyQuestions = shuffledQuestions
      .filter((q) => q.level === "easy")
      .slice(0, 5);
    const mediumQuestions = shuffledQuestions
      .filter((q) => q.level === "medium")
      .slice(0, 5);
    const hardQuestions = shuffledQuestions
      .filter((q) => q.level === "hard")
      .slice(0, 5);

    const gameQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];
    setQuestions(gameQuestions);

    // Define a primeira pergunta
    if (gameQuestions.length > 0) {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: gameQuestions[0],
      }));
    }
  }, [initialGameState]);

  /**
   * Obtém o prêmio atual baseado no score
   */
  const getCurrentPrize = useCallback(() => {
    if (gameState.score === 0) return 0;
    return prizes[gameState.score - 1] || 0;
  }, [gameState.score, prizes]);

  /**
   * Obtém o próximo prêmio
   */
  const getNextPrize = useCallback(() => {
    return prizes[gameState.score] || prizes[prizes.length - 1];
  }, [gameState.score, prizes]);

  /**
   * Verifica se uma opção está escondida (pelas cartas)
   */
  const isOptionHidden = useCallback(
    (optionIndex: number) => {
      return gameState.hiddenOptions.includes(optionIndex);
    },
    [gameState.hiddenOptions]
  );

  return {
    // Estado
    gameState,
    questions,
    prizes,
    showWrongAnswerCard,
    setShowWrongAnswerCard,

    // Ações
    answerQuestion,
    skipQuestion,
    useUniversityHelp,
    useCardsHelp,
    resetGame,

    // Helpers
    getCurrentPrize,
    getNextPrize,
    isOptionHidden,
  };
};
