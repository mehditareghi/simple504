import ProgressBar from '@/components/ui/Progress';
import { API_URL } from '@/utils/constants';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isCorrect) {
      setProgress((prevProgress) => prevProgress + 100 / 15);
    }
  }, [isCorrect]);

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
      setSelectedAnswerIndex(null);
      setAnswer(null);
      setIsCorrect(null);
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
      <h1 className='H1 hidden'>Learning New Words</h1>
      <ProgressBar progress={progress} />
      <h2 className='H2 text-center mt-10'>{data.question}</h2>
      <div className='flex flex-col space-y-4'>
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
      </div>
      <div className='flex justify-center gap-4 mt-10'>
        <button className='btn-prm' disabled={selectedAnswerIndex === null} onClick={onClick}>
          {action}
        </button>
      </div>
    </div>
  );
};

export default Learn;
