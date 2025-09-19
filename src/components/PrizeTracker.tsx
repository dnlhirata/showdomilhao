import React from 'react';
import './PrizeTracker.css';

interface PrizeTrackerProps {
  prizes: number[];
  currentScore: number;
  gameOver: boolean;
  won: boolean;
}

/**
 * Componente que exibe a escada de prêmios do Show do Milhão
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
   * Determina a classe CSS para cada item da escada
   */
  const getPrizeItemClass = (index: number): string => {
    const baseClass = 'prize-item';
    
    if (gameOver && won && index === currentScore - 1) {
      return `${baseClass} prize-won`;
    }
    
    if (gameOver && !won && index === currentScore - 1) {
      return `${baseClass} prize-lost`;
    }
    
    if (index === currentScore - 1) {
      return `${baseClass} prize-current`;
    }
    
    if (index < currentScore) {
      return `${baseClass} prize-completed`;
    }
    
    if (index === currentScore) {
      return `${baseClass} prize-next`;
    }
    
    return baseClass;
  };

  /**
   * Verifica se é um prêmio especial (marcos importantes)
   */
  const isSpecialPrize = (index: number): boolean => {
    // Marcos especiais: 5ª pergunta (R$ 50.000), 10ª pergunta (R$ 500.000), 15ª pergunta (R$ 1.000.000)
    return index === 4 || index === 9 || index === 14;
  };

  return (
    <div className="prize-tracker">
      <h3 className="prize-tracker-title">Escada de Prêmios</h3>
      
      <div className="prize-list">
        {prizes.map((prize, index) => (
          <div
            key={index}
            className={`${getPrizeItemClass(index)} ${isSpecialPrize(index) ? 'prize-special' : ''}`}
          >
            <div className="prize-number">
              {index + 1}
            </div>
            
            <div className="prize-value">
              {formatPrize(prize)}
            </div>
            
            <div className="prize-indicator">
              {index === currentScore - 1 && !gameOver && '👤'}
              {index === currentScore - 1 && gameOver && won && '🏆'}
              {index === currentScore - 1 && gameOver && !won && '❌'}
              {index < currentScore && '✓'}
              {index === currentScore && !gameOver && '🎯'}
              {isSpecialPrize(index) && index >= currentScore && '⭐'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Informações adicionais */}
      <div className="prize-info">
        <div className="current-prize">
          <strong>Prêmio Atual:</strong>{' '}
          {currentScore > 0 ? formatPrize(prizes[currentScore - 1]) : 'R$ 0'}
        </div>
        
        {!gameOver && currentScore < prizes.length && (
          <div className="next-prize">
            <strong>Próximo Prêmio:</strong>{' '}
            {formatPrize(prizes[currentScore])}
          </div>
        )}
        
        {gameOver && (
          <div className={`final-result ${won ? 'result-won' : 'result-lost'}`}>
            {won ? (
              <>
                🎉 <strong>PARABÉNS!</strong> Você ganhou {formatPrize(prizes[prizes.length - 1])}!
              </>
            ) : (
              <>
                😔 <strong>Game Over!</strong> Você levou {currentScore > 0 ? formatPrize(prizes[currentScore - 1]) : 'R$ 0'}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Marcos especiais */}
      <div className="special-milestones">
        <div className="milestone-info">
          <span className="milestone-icon">⭐</span>
          <span className="milestone-text">Marcos Especiais</span>
        </div>
        <div className="milestone-list">
          <div className="milestone">5ª pergunta: {formatPrize(prizes[4])}</div>
          <div className="milestone">10ª pergunta: {formatPrize(prizes[9])}</div>
          <div className="milestone">15ª pergunta: {formatPrize(prizes[14])}</div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTracker;
