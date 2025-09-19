import React, { useEffect, useState } from "react";
import "./CardSelection.css";

interface CardSelectionProps {
  onCardSelect: (cardValue: number) => void;
  onClose: () => void;
  disabled?: boolean;
}

type CardType = 1 | 2 | 3 | "J";

const CardSelection: React.FC<CardSelectionProps> = ({
  onCardSelect,
  onClose,
  disabled = false,
}) => {
  const [shuffledCards, setShuffledCards] = useState<CardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Shuffle cards on component mount
  useEffect(() => {
    const cards: CardType[] = [1, 2, 3, "J"];
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, []);

  const handleCardClick = (card: CardType) => {
    if (disabled || selectedCard) return;

    setSelectedCard(card);

    // Show card for 1.5 seconds then apply effect
    setTimeout(() => {
      const cardValue = card === "J" ? 0 : card;
      onCardSelect(cardValue);
    }, 1500);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !selectedCard) {
      onClose();
    }
  };

  return (
    <div className="card-selection-overlay" onClick={handleOverlayClick}>
      <div className="card-selection-modal">
        <div className="card-selection-header">
          <h3>🃏 Escolha uma Carta</h3>
          <p>
            Selecione uma carta para descobrir quantas alternativas incorretas
            serão eliminadas
          </p>
        </div>

        <div className="cards-container">
          {shuffledCards.map((card, index) => (
            <div
              key={index}
              className={`card ${selectedCard === card ? "selected" : ""} ${
                selectedCard && selectedCard !== card ? "dimmed" : ""
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-front">
                <div className="card-back-pattern">🂠</div>
              </div>
              {selectedCard === card && (
                <div className="card-reveal">
                  <div className="card-value">{card}</div>
                  <div className="card-description">
                    {card === "J"
                      ? "Nenhuma alternativa eliminada"
                      : `${card} alternativa${card > 1 ? "s" : ""} eliminada${
                          card > 1 ? "s" : ""
                        }`}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!selectedCard && (
          <div className="card-selection-footer">
            <button className="close-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>
        )}

        {selectedCard && (
          <div className="card-result">
            <div className="result-text">
              {selectedCard === "J"
                ? "😔 Que azar! Nenhuma alternativa será eliminada."
                : `🎉 Ótimo! ${selectedCard} alternativa${
                    selectedCard > 1 ? "s" : ""
                  } incorreta${selectedCard > 1 ? "s" : ""} será${
                    selectedCard > 1 ? "ão" : ""
                  } eliminada${selectedCard > 1 ? "s" : ""}.`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSelection;
