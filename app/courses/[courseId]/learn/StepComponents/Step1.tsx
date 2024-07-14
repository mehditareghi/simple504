// app/courses/[courseId]/learn/StepComponents/Step1.tsx
import React from 'react';

interface Step1Props {
  word: {
    word: string;
    definitions: string[];
    examples: string[];
  };
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ word, onNext }) => {
  return (
    <div>
      <h2>{word.word}</h2>
      <p>Definitions: {word.definitions.join(', ')}</p>
      <p>Examples: {word.examples.join(', ')}</p>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Step1;
