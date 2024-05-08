import { Question } from '@/types';

const Listening = ({
  data,
  selectedAnswerIndex,
  onAnswerSelected,
  isCorrect,
}: {
  data: Question;
  selectedAnswerIndex: number | null;
  onAnswerSelected: (index: number) => void;
  isCorrect: boolean | null;
}) => {
  return (
    <>
      <h2 className='H2 text-center mt-10'>{data.question}</h2>
      {data.words.map((word, index) => (
        <button
          key={index}
          className={`flex-grow flex justify-start font-bold align-center cursor-pointer mt-4 p-4 rounded-xl ${
            selectedAnswerIndex === index
              ? isCorrect === null
                ? 'bg-orange5 border border-orange7'
                : isCorrect
                ? 'bg-green5 border border-green7'
                : 'bg-red5 border border-red7'
              : data.answer.id === word.id && isCorrect === false
              ? 'bg-green5 border border-green7'
              : 'bg-base3 c-base11'
          }`}
          onClick={() => onAnswerSelected(index)}
        >
          {word.word}
        </button>
      ))}
    </>
  );
};

export default Listening;
