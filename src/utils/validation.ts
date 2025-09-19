import type { Question, GameState } from '../types';

/**
 * Resultado da validação de uma resposta
 */
export interface ValidationResult {
  isValid: boolean;
  isCorrect?: boolean;
  error?: string;
  canProceed: boolean;
  gameEndReason?: 'won' | 'lost' | 'continue';
}

/**
 * Valida se uma opção de resposta é válida
 */
export const validateAnswerOption = (
  optionIndex: number,
  question: Question | null
): { isValid: boolean; error?: string } => {
  // Verifica se há pergunta atual
  if (!question) {
    return {
      isValid: false,
      error: 'Nenhuma pergunta ativa'
    };
  }

  // Verifica se o índice da opção é válido
  if (optionIndex < 0 || optionIndex >= question.options.length) {
    return {
      isValid: false,
      error: `Índice de opção inválido: ${optionIndex}. Deve estar entre 0 e ${question.options.length - 1}`
    };
  }

  // Verifica se a opção não está vazia
  if (!question.options[optionIndex] || question.options[optionIndex].trim() === '') {
    return {
      isValid: false,
      error: 'Opção de resposta vazia'
    };
  }

  return { isValid: true };
};

/**
 * Valida se o jogo pode aceitar uma resposta
 */
export const validateGameState = (gameState: GameState): { isValid: boolean; error?: string } => {
  // Verifica se o jogo já terminou
  if (gameState.gameOver) {
    return {
      isValid: false,
      error: 'O jogo já terminou'
    };
  }

  // Verifica se há pergunta atual
  if (!gameState.currentQuestion) {
    return {
      isValid: false,
      error: 'Nenhuma pergunta ativa'
    };
  }

  // Verifica se o índice da pergunta é válido
  if (gameState.currentQuestionIndex < 0) {
    return {
      isValid: false,
      error: 'Índice de pergunta inválido'
    };
  }

  return { isValid: true };
};

/**
 * Valida uma resposta completa (estado + opção)
 */
export const validateAnswer = (
  optionIndex: number,
  gameState: GameState
): ValidationResult => {
  // Valida o estado do jogo
  const gameStateValidation = validateGameState(gameState);
  if (!gameStateValidation.isValid) {
    return {
      isValid: false,
      error: gameStateValidation.error,
      canProceed: false
    };
  }

  // Valida a opção de resposta
  const optionValidation = validateAnswerOption(optionIndex, gameState.currentQuestion);
  if (!optionValidation.isValid) {
    return {
      isValid: false,
      error: optionValidation.error,
      canProceed: false
    };
  }

  // Verifica se a opção está escondida pelas cartas
  if (gameState.hiddenOptions.includes(optionIndex)) {
    return {
      isValid: false,
      error: 'Esta opção foi eliminada pelas cartas',
      canProceed: false
    };
  }

  // Se chegou até aqui, a validação passou
  const isCorrect = optionIndex === gameState.currentQuestion!.correct;
  
  return {
    isValid: true,
    isCorrect,
    canProceed: true,
    gameEndReason: isCorrect ? 'continue' : 'lost'
  };
};

/**
 * Valida se é possível usar uma ajuda
 */
export const validateHelpUsage = (
  helpType: 'skip' | 'university' | 'cards',
  gameState: GameState
): { isValid: boolean; error?: string } => {
  // Valida o estado básico do jogo
  const gameStateValidation = validateGameState(gameState);
  if (!gameStateValidation.isValid) {
    return gameStateValidation;
  }

  switch (helpType) {
    case 'skip':
      if (gameState.skipsLeft <= 0) {
        return {
          isValid: false,
          error: 'Não há mais pulos disponíveis'
        };
      }
      break;

    case 'university':
      if (gameState.universitiesUsed) {
        return {
          isValid: false,
          error: 'A ajuda dos universitários já foi usada'
        };
      }
      break;

    case 'cards':
      if (gameState.cardsUsed) {
        return {
          isValid: false,
          error: 'As cartas já foram usadas'
        };
      }
      break;

    default:
      return {
        isValid: false,
        error: 'Tipo de ajuda inválido'
      };
  }

  return { isValid: true };
};

/**
 * Valida o valor das cartas
 */
export const validateCardValue = (cardValue: number): { isValid: boolean; error?: string } => {
  if (![1, 2, 3].includes(cardValue)) {
    return {
      isValid: false,
      error: 'Valor de carta inválido. Deve ser 1, 2 ou 3'
    };
  }

  return { isValid: true };
};

/**
 * Valida se uma pergunta está bem formada
 */
export const validateQuestion = (question: Question): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Verifica se tem pergunta
  if (!question.question || question.question.trim() === '') {
    errors.push('Pergunta vazia');
  }

  // Verifica se tem exatamente 4 opções
  if (!question.options || question.options.length !== 4) {
    errors.push('Deve ter exatamente 4 opções de resposta');
  } else {
    // Verifica se todas as opções estão preenchidas
    question.options.forEach((option, index) => {
      if (!option || option.trim() === '') {
        errors.push(`Opção ${index + 1} está vazia`);
      }
    });
  }

  // Verifica se o índice da resposta correta é válido
  if (question.correct < 0 || question.correct >= 4) {
    errors.push('Índice da resposta correta inválido');
  }

  // Verifica se o nível é válido
  if (!['easy', 'medium', 'hard'].includes(question.level)) {
    errors.push('Nível da pergunta inválido');
  }

  // Verifica se tem ID válido
  if (!question.id || question.id <= 0) {
    errors.push('ID da pergunta inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calcula o próximo estado após uma resposta
 */
export const calculateNextGameState = (
  currentState: GameState,
  optionIndex: number,
  totalQuestions: number
): Partial<GameState> => {
  const validation = validateAnswer(optionIndex, currentState);
  
  if (!validation.isValid || !validation.isCorrect) {
    // Resposta errada ou inválida - Game Over
    return {
      gameOver: true,
      won: false,
      currentQuestion: null
    };
  }

  // Resposta correta
  const nextIndex = currentState.currentQuestionIndex + 1;
  const newScore = currentState.currentQuestionIndex + 1;

  if (nextIndex >= totalQuestions) {
    // Ganhou o jogo!
    return {
      score: newScore,
      gameOver: true,
      won: true,
      currentQuestion: null
    };
  }

  // Continua o jogo
  return {
    currentQuestionIndex: nextIndex,
    score: newScore,
    hiddenOptions: [] // Reset das opções escondidas
  };
};

/**
 * Utilitário para debug - gera relatório do estado do jogo
 */
export const generateGameStateReport = (gameState: GameState): string => {
  const lines = [
    '=== RELATÓRIO DO ESTADO DO JOGO ===',
    `Pergunta atual: ${gameState.currentQuestionIndex + 1}`,
    `Score: ${gameState.score}`,
    `Pulos restantes: ${gameState.skipsLeft}`,
    `Universitários usados: ${gameState.universitiesUsed ? 'Sim' : 'Não'}`,
    `Cartas usadas: ${gameState.cardsUsed ? 'Sim' : 'Não'}`,
    `Jogo terminado: ${gameState.gameOver ? 'Sim' : 'Não'}`,
    `Ganhou: ${gameState.won ? 'Sim' : 'Não'}`,
    `Opções escondidas: [${gameState.hiddenOptions.join(', ')}]`,
    `Pergunta ativa: ${gameState.currentQuestion ? 'Sim' : 'Não'}`
  ];

  if (gameState.currentQuestion) {
    lines.push(`Texto da pergunta: "${gameState.currentQuestion.question}"`);
    lines.push(`Resposta correta: ${gameState.currentQuestion.correct}`);
    lines.push(`Nível: ${gameState.currentQuestion.level}`);
  }

  return lines.join('\n');
};
