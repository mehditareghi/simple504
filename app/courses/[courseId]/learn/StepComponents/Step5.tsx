// StepComponents/Step5.tsx
import { useState } from 'react';

interface Step5Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step5: React.FC<Step5Props> = ({ word, onAnswer }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    speechSynthesis.speak(utterance);
  };

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
      <h2>Select the correct word for the pronunciation:</h2>
      <button onClick={handlePlayAudio}>Play Pronunciation</button>
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

export default Step5;
