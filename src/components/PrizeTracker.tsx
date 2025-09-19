import React from "react";
import "./PrizeTracker.css";

interface PrizeTrackerProps {
  prizes: string[];
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
  won,
}) => {
  /**
   * Obtém o prêmio atual
   */
  const getCurrentPrize = (): string => {
    if (currentScore <= 0) return "Nenhum prêmio ainda";
    return prizes[currentScore - 1] || "Nenhum prêmio";
  };

  /**
   * Obtém o próximo prêmio
   */
  const getNextPrize = (): string => {
    if (currentScore >= prizes.length) return prizes[prizes.length - 1];
    return prizes[currentScore] || prizes[prizes.length - 1];
  };

  const currentPrize = getCurrentPrize();
  const nextPrize = getNextPrize();

  return (
    <div className="prize-tracker-show">
      {/* Layout horizontal dos prêmios */}
      <div className="prizes-display">
        {/* Prêmio Atual (Esquerda) */}
        <div className="prize-section current">
          <div className="prize-label">PRÊMIO ATUAL</div>
          <div className="prize-value current-value">{currentPrize}</div>
          <div className="prize-description">
            {gameOver && won ? "CONQUISTADO!" : "Em jogo"}
          </div>
        </div>

        {/* Próximo Prêmio (Direita) */}
        <div className="prize-section next">
          <div className="prize-label">PRÓXIMO PRÊMIO</div>
          <div className="prize-value next-value">
            {currentScore >= prizes.length ? "FIM DO JOGO" : nextPrize}
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
