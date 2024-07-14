// StepComponents/Step6.tsx
import { useState } from 'react';

interface Step6Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step6: React.FC<Step6Props> = ({ word, onAnswer }) => {
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
    if (selectedDefinition && word.definitions.includes(selectedDefinition)) {
      onAnswer(true);
    } else {
      onAnswer(false);
    }
  };

  const otherDefinitions = ['incorrect definition 1', 'incorrect definition 2', 'incorrect definition 3']; // Replace with actual incorrect definitions logic

  return (
    <div>
      <h2>Select the correct definition for the pronunciation:</h2>
      <button onClick={handlePlayAudio}>Play Pronunciation</button>
      <div>
        {[...word.definitions, ...otherDefinitions].sort().map((option) => (
          <button
            key={option}
            onClick={() => setSelectedDefinition(option)}
            style={{ background: selectedDefinition === option ? 'lightblue' : 'white' }}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Step6;
