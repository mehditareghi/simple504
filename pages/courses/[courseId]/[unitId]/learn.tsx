import { API_URL } from '@/utils/constants';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';

type Word = {
  id: number;
  word: string;
  part_of_speech: string;
  definition: string;
  examples: string;
  image: string;
  adjective: string;
  noun: string;
  unit: number;
  created_at: string;
  updated_at: string;
};

type Metadata = {
  correct: number;
  incorrect: number;
  current: number;
  max: number;
};

type Question = {
  question: string;
  next: string | null;
  words: Word[];
  answer: Word;
  metadata: Metadata;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { unitId } = context.query;
  const token = context.req.cookies.token; // assuming the token is stored in cookies

  let firstQuestion: Question | null = null;

  try {
    const response = await fetch(`${API_URL}/lesson/unit/${unitId}/start-learning/1`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    firstQuestion = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      firstQuestion,
      token,
    },
  };
}

const Learn = ({ firstQuestion, token }: { firstQuestion: Question; token: string }) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState<null | number>(null);
  const [data, setData] = useState<Question>(firstQuestion);
  const [action, setAction] = useState('Submit');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const onAnswerSelected = (index: number) => {
    if (isCorrect !== null) return;
    setAnswer(data.words[index].id);
    setSelectedAnswerIndex(index);
  };

  const onSubmit = async () => {
    if (answer === data.answer.id) {
      setIsCorrect(true);
      if (data.next !== null) {
        setAction('Next');
      } else {
        setAction('Finish');
      }
    } else {
      setIsCorrect(false);
      if (data.next !== null) {
        setAction('Next');
      } else {
        setAction('Finish');
      }
    }
  };

  const onClickNext = async () => {
    if (data.next) {
      const response = await fetch(data.next, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const nextData = await response.json();
      setData(nextData);
      setAction('Submit');
    }
  };

  const onClick = async () => {
    if (action === 'Submit') {
      onSubmit();
    } else if (action === 'Next' && data.next) {
      onClickNext();
    }
  };

  return (
    <div>
      <h1>Learning New Words</h1>
      <h2 className='font-semibold text-center mt-4'>{data.question}</h2>
      <form className='mt-[5%] w-full'>
        {data.words.map((word, index) => (
          <div
            key={index}
            className={`flex justify-start align-center cursor-pointer mt-4 rounded-full w-full ${
              selectedAnswerIndex === index
                ? isCorrect === null
                  ? 'bg-orange-50 border border-orange-400 border-dashed'
                  : isCorrect
                  ? 'bg-green-50 border border-green-400 border-dashed'
                  : 'bg-red-50 border border-red-400 border-dashed'
                : data.answer.id === word.id && isCorrect === false
                ? 'bg-green-50 border border-green-400 border-dashed'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <input
              type='radio'
              id={word.word}
              name='answer'
              value={word.id}
              checked={selectedAnswerIndex === index}
              onChange={() => onAnswerSelected(index)}
              className={`ml-4`}
            />
            <label
              htmlFor={word.word}
              className={`inline-block text-gray-500 cursor-pointer px-3 py-2 rounded-full w-full`}
            >
              {word.word}
            </label>
          </div>
        ))}
      </form>
      <div className='flex justify-center gap-4 mt-10'>
        <button
          className='w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none'
          disabled={selectedAnswerIndex === null}
          onClick={onClick}
        >
          {action}
        </button>
      </div>
    </div>
  );
};

export default Learn;
