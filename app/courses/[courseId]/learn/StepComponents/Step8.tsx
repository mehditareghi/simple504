// StepComponents/Step8.tsx
import { useForm } from 'react-hook-form';

interface Step8Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step8: React.FC<Step8Props> = ({ word, onAnswer }) => {
  const { register, handleSubmit, reset } = useForm<{ typedWord: string }>();

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    speechSynthesis.speak(utterance);
  };

  const onSubmit = (data: { typedWord: string }) => {
    if (data.typedWord.trim().toLowerCase() === word.word.toLowerCase()) {
      onAnswer(true);
    } else {
      onAnswer(false);
    }
    reset();
  };

  return (
    <div>
      <h2>Type the word for the pronunciation:</h2>
      <button onClick={handlePlayAudio}>Play Pronunciation</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='text' {...register('typedWord', { required: true })} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Step8;
