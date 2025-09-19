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
  const [prizes] = useState<string[]>((questionsData as QuestionsData).prizes);
  const [showWrongAnswerCard, setShowWrongAnswerCard] = useState(false);

  // Carrega todas as perguntas em ordem aleatória
  useEffect(() => {
    const loadedQuestions = (questionsData as QuestionsData).questions;
    // Embaralha todas as perguntas
    const shuffledQuestions = [...loadedQuestions].sort(
      () => Math.random() - 0.5
    );

    setQuestions(shuffledQuestions);

    // Define a primeira pergunta
    if (shuffledQuestions.length > 0) {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: shuffledQuestions[0],
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

      // Check if this was the last question
      if (nextIndex >= questions.length) {
        // Game ends only when all questions are answered
        setGameState((prev) => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          gameOver: true,
          won: true, // Always win when completing all questions
          currentQuestion: null,
        }));
      } else {
        // Continue to next question regardless of correct/incorrect
        setGameState((prev) => ({
          ...prev,
          currentQuestionIndex: nextIndex,
          currentQuestion: questions[nextIndex],
          score: isCorrect ? prev.score + 1 : prev.score, // Only increment score on correct
          hiddenOptions: [], // Reset das opções escondidas
        }));

        // Show wrong answer card if incorrect
        if (!isCorrect) {
          setShowWrongAnswerCard(true);
        }
      }
    },
    [
      gameState.gameOver,
      gameState.currentQuestion,
      gameState.currentQuestionIndex,
      questions,
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
        won: true, // Always win when completing all questions
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

    // Reembaralha todas as perguntas
    const loadedQuestions = (questionsData as QuestionsData).questions;
    const shuffledQuestions = [...loadedQuestions].sort(
      () => Math.random() - 0.5
    );

    setQuestions(shuffledQuestions);

    // Define a primeira pergunta
    if (shuffledQuestions.length > 0) {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: shuffledQuestions[0],
      }));
    }
  }, [initialGameState]);

  /**
   * Obtém o prêmio atual baseado no score
   */
  const getCurrentPrize = useCallback(() => {
    if (gameState.score === 0) return "Nenhum prêmio ainda";
    return prizes[gameState.score - 1] || "Nenhum prêmio";
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
