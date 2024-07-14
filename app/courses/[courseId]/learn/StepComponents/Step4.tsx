// StepComponents/Step4.tsx
import { useState } from 'react';

interface Step4Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step4: React.FC<Step4Props> = ({ word, onAnswer }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const example = word.examples[0].replace(word.word, '______'); // Replace the word in the first example

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
      <h2>Select the correct word to complete the example:</h2>
      <p>{example}</p>
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

export default Step4;
