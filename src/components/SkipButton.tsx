import React from 'react';
import './SkipButton.css';

interface SkipButtonProps {
  skipsLeft: number;
  onSkip: () => void;
  disabled?: boolean;
  gameOver?: boolean;
}

/**
 * Componente do botão "Pular pergunta" com contador visual
 */
export const SkipButton: React.FC<SkipButtonProps> = ({
  skipsLeft,
  onSkip,
  disabled = false,
  gameOver = false
}) => {
  const isDisabled = disabled || skipsLeft <= 0 || gameOver;

  const handleClick = () => {
    if (!isDisabled) {
      onSkip();
    }
  };

  return (
    <div className="skip-button-container">
      <button
        className={`skip-button ${isDisabled ? 'skip-disabled' : 'skip-enabled'}`}
        onClick={handleClick}
        disabled={isDisabled}
        title={
          gameOver 
            ? 'Jogo finalizado'
            : skipsLeft <= 0 
              ? 'Sem pulos restantes' 
              : `Pular pergunta (${skipsLeft} restantes)`
        }
      >
        <div className="skip-icon">
          ⏭️
        </div>
        
        <div className="skip-text">
          <span className="skip-label">PULAR</span>
          <span className="skip-subtitle">Pergunta</span>
        </div>
        
        <div className="skip-counter">
          <div className="counter-number">{skipsLeft}</div>
          <div className="counter-label">restantes</div>
        </div>
      </button>
      
      {/* Indicadores visuais dos pulos */}
      <div className="skip-indicators">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`skip-dot ${
              index <= skipsLeft ? 'dot-available' : 'dot-used'
            }`}
            title={`Pulo ${index} ${index <= skipsLeft ? 'disponível' : 'usado'}`}
          >
            {index <= skipsLeft ? '●' : '○'}
          </div>
        ))}
      </div>
      
      {/* Mensagem de status */}
      <div className="skip-status">
        {gameOver ? (
          <span className="status-game-over">Jogo finalizado</span>
        ) : skipsLeft <= 0 ? (
          <span className="status-no-skips">Sem pulos restantes</span>
        ) : skipsLeft === 1 ? (
          <span className="status-warning">Último pulo!</span>
        ) : (
          <span className="status-available">
            {skipsLeft} pulos disponíveis
          </span>
        )}
      </div>
    </div>
  );
};

export default SkipButton;
