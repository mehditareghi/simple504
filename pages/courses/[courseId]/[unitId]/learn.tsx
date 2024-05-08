import ProgressBar from '@/components/ui/Progress';
import { API_URL } from '@/utils/constants';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import Intro from '@/components/ui/questions/Intro';
import Card from '@/components/ui/questions/Card';
import { Question } from '@/types';
import Listening from '@/components/ui/questions/Listening';
import Writing from '@/components/ui/questions/Writing';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { unitId } = context.query;
  const token = context.req.cookies.token;

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
      unitId,
    },
  };
}

const Learn = ({ firstQuestion, token, unitId }: { firstQuestion: Question; token: string; unitId: number }) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState<null | number>(null);
  const [data, setData] = useState<Question>(firstQuestion);
  const [action, setAction] = useState('Submit');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isCorrect && data.study_type !== 'intro') {
      setProgress((prevProgress) => prevProgress + 100 / 15);
    }
  }, [isCorrect, data]);

  useEffect(() => {
    if (data.study_type === 'intro') {
      setSelectedAnswerIndex(0);
      setAnswer(data.words[0].id);
    }
  }, [data]);

  const onAnswerSelected = (index: number) => {
    if (isCorrect !== null) return;
    setAnswer(data.words[index].id);
    setSelectedAnswerIndex(index);
  };

  const onSubmit = async () => {
    if (answer === data.answer.id) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    const response = await fetch(`${API_URL}/lesson/unit/${unitId}/start-learning/${data.metadata.learn_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ id: answer }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (data.metadata.correct === data.metadata.max_correct - 1 && isCorrect === true) {
      setAction('Finish');
    } else {
      setAction('Next');
    }
  };

  const onClickNext = async () => {
    const response = await fetch(data.next_url, {
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
  };

  const onClickFinish = async () => {
    const response = await fetch(data.next_url, {
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

  const onClick = async () => {
    if (action === 'Submit') {
      onSubmit();
    } else if (action === 'Next') {
      onClickNext();
    } else if (action === 'finish') {
      onClickFinish();
    }
  };

  return (
    <div>
      <h1 className='H1 hidden'>Learning New Words</h1>
      <ProgressBar progress={progress} />
      <div className='flex flex-col space-y-4'>
        {data.study_type === 'intro' && <Intro data={data} />}
        {data.study_type === 'card' && (
          <Card
            data={data}
            selectedAnswerIndex={selectedAnswerIndex}
            onAnswerSelected={onAnswerSelected}
            isCorrect={isCorrect}
          />
        )}
        {data.study_type === 'listening' && (
          <Listening
            data={data}
            selectedAnswerIndex={selectedAnswerIndex}
            onAnswerSelected={onAnswerSelected}
            isCorrect={isCorrect}
          />
        )}
        {data.study_type === 'writing' && (
          <Writing
            data={data}
            selectedAnswerIndex={selectedAnswerIndex}
            onAnswerSelected={onAnswerSelected}
            isCorrect={isCorrect}
          />
        )}
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
