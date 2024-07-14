// StepComponents/Step3.tsx
import { useState } from 'react';

interface Step3Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step3: React.FC<Step3Props> = ({ word, onAnswer }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const definitions = word.definitions[0]; // Assuming the first definition for simplicity

  const handleSubmit = () => {
    if (selectedWord === word.word) {
      onAnswer(true);
    } else {
      onAnswer(false);
    }
  };

  const otherWords = ['incorrect1', 'incorrect2', 'incorrect3']; // Replace with actual incorrect words logic

  return (
    <div>
      <h2>Select the word for this definition:</h2>
      <p>{definitions}</p>
      <div>
        {[word.word, ...otherWords].sort().map((option) => (
          <button
            key={option}
            onClick={() => setSelectedWord(option)}
            style={{ background: selectedWord === option ? 'lightblue' : 'white' }}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Step3;
