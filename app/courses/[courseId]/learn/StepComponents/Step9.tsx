// StepComponents/Step9.tsx
import { useForm } from 'react-hook-form';

interface Step9Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step9: React.FC<Step9Props> = ({ word, onAnswer }) => {
  const { register, handleSubmit, reset } = useForm<{ typedWord: string }>();

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
      <h2>Type the word for the given definitions:</h2>
      <div>
        {word.definitions.map((definition, index) => (
          <p key={index}>{definition}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='text' {...register('typedWord', { required: true })} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Step9;
