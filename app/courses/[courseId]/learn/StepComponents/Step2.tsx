// app/courses/[courseId]/learn/StepComponents/Step2.tsx
import React from 'react';

interface Step2Props {
  word: {
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step2: React.FC<Step2Props> = ({ word, onAnswer }) => {
  const handleCorrectAnswer = () => onAnswer(true);
  const handleIncorrectAnswer = () => onAnswer(false);

  return (
    <div>
      <h2>{word.word}</h2>
      <button onClick={handleCorrectAnswer}>Correct Answer</button>
      <button onClick={handleIncorrectAnswer}>Incorrect Answer</button>
    </div>
  );
};

export default Step2;
