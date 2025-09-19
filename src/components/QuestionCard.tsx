import React from "react";
import type { Question } from "../types";
import "./QuestionCard.css";

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionIndex: number) => void;
  hiddenOptions?: number[];
  disabled?: boolean;
  selectedOption?: number;
  showResult?: boolean;
  isCorrect?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  hiddenOptions = [],
  disabled = false,
  selectedOption,
  showResult = false,
  isCorrect,
}) => {
  const handleOptionClick = (optionIndex: number) => {
    if (disabled || hiddenOptions.includes(optionIndex)) {
      return;
    }
    onAnswer(optionIndex);
  };

  const getOptionClass = (optionIndex: number) => {
    const baseClass = "question-option";
    const classes = [baseClass];

    if (hiddenOptions.includes(optionIndex)) {
      classes.push("option-hidden");
    }

    if (selectedOption === optionIndex) {
      classes.push("option-selected");
    }

    if (showResult) {
      if (selectedOption === optionIndex) {
        // This is the option the user selected
        classes.push(isCorrect ? "option-correct" : "option-incorrect");
      } else if (optionIndex === question.correct && !isCorrect) {
        // Show the correct answer only when user was wrong
        classes.push("option-correct");
      }
    }

    if (disabled) {
      classes.push("option-disabled");
    }

    return classes.join(" ");
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-level">
          <span className={`level-badge level-${question.level}`}>
            {question.level.toUpperCase()}
          </span>
        </div>
        <div className="question-number">Pergunta #{question.id}</div>
      </div>

      <div className="question-text">
        <h2>{question.question}</h2>
      </div>

      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(index)}
            onClick={() => handleOptionClick(index)}
            disabled={disabled || hiddenOptions.includes(index)}
            style={{
              visibility: hiddenOptions.includes(index) ? "hidden" : "visible",
              opacity: hiddenOptions.includes(index) ? 0.3 : 1,
            }}
          >
            <span className="option-letter">{getOptionLetter(index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
