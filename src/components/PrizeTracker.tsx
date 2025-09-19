import React from 'react';
import './PrizeTracker.css';

interface PrizeTrackerProps {
  prizes: number[];
  currentScore: number;
  gameOver: boolean;
  won: boolean;
}

/**
 * Componente que exibe os prêmios no estilo Show do Milhão
 * Mostra: Prêmio Garantido (esquerda) | Prêmio Atual (centro) | Próximo Prêmio (direita)
 */
export const PrizeTracker: React.FC<PrizeTrackerProps> = ({
  prizes,
  currentScore,
  gameOver,
  won
}) => {
  /**
   * Formata o valor do prêmio em reais
   */
  const formatPrize = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  /**
   * Calcula o prêmio garantido (que o jogador leva se errar)
   */
  const getGuaranteedPrize = (): number => {
    if (currentScore <= 0) return 0;
    
    // Marcos de parada garantidos (no Show do Milhão real)
    // 1ª pergunta = R$ 0 garantido
    // 2ª-5ª pergunta = R$ 1.000 garantido  
    // 6ª-10ª pergunta = R$ 50.000 garantido
    // 11ª+ pergunta = R$ 500.000 garantido
    
    if (currentScore <= 1) return 0;
    if (currentScore <= 5) return prizes[0]; // R$ 1.000
    if (currentScore <= 10) return prizes[4]; // R$ 50.000
    return prizes[8]; // R$ 500.000
  };

  /**
   * Obtém o prêmio atual
   */
  const getCurrentPrize = (): number => {
    if (currentScore <= 0) return 0;
    return prizes[currentScore - 1] || 0;
  };

  /**
   * Obtém o próximo prêmio
   */
  const getNextPrize = (): number => {
    if (currentScore >= prizes.length) return prizes[prizes.length - 1];
    return prizes[currentScore] || prizes[prizes.length - 1];
  };

  /**
   * Determina o status do jogo para exibição
   */
  const getGameStatus = () => {
    if (gameOver) {
      if (won) {
        return {
          message: "PARABÉNS! VOCÊ É MILIONÁRIO!",
          className: "status-won"
        };
      } else {
        return {
          message: `GAME OVER! Você levou ${formatPrize(getGuaranteedPrize())}`,
          className: "status-lost"
        };
      }
    }
    
    return {
      message: `Pergunta ${currentScore + 1} de ${prizes.length}`,
      className: "status-playing"
    };
  };

  const guaranteedPrize = getGuaranteedPrize();
  const currentPrize = getCurrentPrize();
  const nextPrize = getNextPrize();
  const status = getGameStatus();

  return (
    <div className="prize-tracker-show">
      {/* Layout horizontal dos prêmios */}
      <div className="prizes-display">
        
        {/* Prêmio Garantido (Esquerda) */}
        <div className="prize-section guaranteed">
          <div className="prize-label">GARANTIDO</div>
          <div className="prize-value guaranteed-value">
            {formatPrize(guaranteedPrize)}
          </div>
          <div className="prize-description">
            {guaranteedPrize === 0 ? "Nada garantido" : "Se errar"}
          </div>
        </div>

        {/* Prêmio Atual (Centro) */}
        <div className="prize-section current">
          <div className="prize-label">ATUAL</div>
          <div className="prize-value current-value">
            {formatPrize(currentPrize)}
          </div>
          <div className="prize-description">
            {gameOver && won ? "CONQUISTADO!" : gameOver ? "Perdido" : "Em jogo"}
          </div>
        </div>

        {/* Próximo Prêmio (Direita) */}
        <div className="prize-section next">
          <div className="prize-label">PRÓXIMO</div>
          <div className="prize-value next-value">
            {currentScore >= prizes.length ? "FIM" : formatPrize(nextPrize)}
          </div>
          <div className="prize-description">
            {currentScore >= prizes.length ? "Completo" : "Objetivo"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrizeTracker;
