// src/types.ts

/**
 * Interface para representar uma pergunta do quiz
 */
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  level: "easy" | "medium" | "hard";
}

/**
 * Estado principal do jogo
 */
export interface GameState {
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  score: number;
  skipsLeft: number;
  universitiesUsed: boolean;
  cardsUsed: boolean;
  gameOver: boolean;
  won: boolean;
  hiddenOptions: number[];
}

/**
 * Tipos de ajuda disponíveis no jogo
 */
export type HelpType = "skip" | "university" | "cards";

/**
 * Interface para o resultado da ajuda dos universitários
 * Representa a porcentagem de votos para cada alternativa
 */
export interface UniversityHelpResult {
  percentages: number[]; // Array com 4 posições (uma para cada alternativa)
}

/**
 * Valores possíveis para as cartas (elimina 1, 2 ou 3 alternativas incorretas)
 */
export type CardValue = 1 | 2 | 3;

/**
 * Interface para o arquivo de perguntas JSON
 */
export interface QuestionsData {
  questions: Question[];
  prizes: string[];
}

/**
 * Status possíveis de uma resposta
 */
export type AnswerStatus = "correct" | "incorrect" | "unanswered";

/**
 * Interface para representar uma resposta dada pelo jogador
 */
export interface PlayerAnswer {
  questionId: number;
  selectedOption: number;
  status: AnswerStatus;
  timestamp: Date;
}

/**
 * Configurações do jogo
 */
export interface GameConfig {
  maxQuestions: number;
  maxSkips: number;
  prizeLevels: number[];
}
