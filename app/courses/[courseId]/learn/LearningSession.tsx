'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Step1 from './StepComponents/Step1';
import Step2 from './StepComponents/Step2';
import Step3 from './StepComponents/Step3';
import Step4 from './StepComponents/Step4';
import Step5 from './StepComponents/Step5';
import Step6 from './StepComponents/Step6';
import Step7 from './StepComponents/Step7';
import Step8 from './StepComponents/Step8';
import Step9 from './StepComponents/Step9';

interface Word {
  id: string;
  word: string;
  definitions: string[];
  examples: string[];
}

interface SessionData {
  sessionId: string;
  targetCorrectAnswers: number;
  words: Word[];
}

const fetchSession = async (userId: string, courseId: string): Promise<SessionData> => {
  const response = await fetch('/api/create-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, maxWords: 10, newWordsCount: 3 }),
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json();
};

const progressSession = async (sessionId: string, wordId: string, correct: boolean, step: number) => {
  const response = await fetch('/api/progress-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, wordId, correct, step }),
  });

  if (!response.ok) {
    throw new Error('Failed to progress session');
  }

  return response.json();
};

const completeSession = async (sessionId: string, userId: string) => {
  const response = await fetch('/api/complete-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete session');
  }

  return response.json();
};

interface LearningSessionProps {
  courseId: string;
  userId: string;
}

export default function LearningSession({ courseId, userId }: LearningSessionProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('Initializing session for user:', userId);
        const sessionData = await fetchSession(userId);
        setSessionId(sessionData.sessionId);
        setWords(sessionData.words || []);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [userId]);

  const handleNextStep = async () => {
    if (!sessionId || !words[currentWordIndex]) return;

    const wordId = words[currentWordIndex].id;
    const nextStep = currentStep + 1;

    await progressSession(sessionId, wordId, true, nextStep);
    setCurrentStep(nextStep);
  };

  const handleAnswer = async (correct: boolean) => {
    console.log('Handling answer:', { correct, sessionId, wordId: words[currentWordIndex]?.id });
    if (!sessionId || !words[currentWordIndex]) return;

    const wordId = words[currentWordIndex].id;
    await progressSession(sessionId, wordId, correct, currentStep);
    if (correct) {
      if (currentStep < 9) {
        setCurrentStep(currentStep + 1);
      } else {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setCurrentStep(1);
        } else {
          await completeSession(sessionId, userId);
          router.push(`/courses/${courseId}`);
        }
      }
    } else {
      setCurrentStep(1);
    }
  };

  const renderCurrentStep = () => {
    const word = words[currentWordIndex];
    console.log(`Rendering step ${currentStep} for word: ${word.word}`);
    switch (currentStep) {
      case 1:
        return <Step1 word={word} onNext={handleNextStep} />;
      case 2:
        return <Step2 word={word} onAnswer={handleAnswer} courseId={courseId} />;
      case 3:
        return <Step3 word={word} onAnswer={handleAnswer} courseId={courseId} />;
      case 4:
        return <Step4 word={word} onAnswer={handleAnswer} courseId={courseId} />;
      case 5:
        return <Step5 word={word} onAnswer={handleAnswer} courseId={courseId} />;
      case 6:
        return <Step6 word={word} onAnswer={handleAnswer} courseId={courseId} />;
      case 7:
        return <Step7 word={word} onAnswer={handleAnswer} />;
      case 8:
        return <Step8 word={word} onAnswer={handleAnswer} />;
      case 9:
        return <Step9 word={word} onAnswer={handleAnswer} />;
      // Add other cases for different steps
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!words.length) return <div>No words available for this session</div>;

  return (
    <div>
      <h1>Learning Session</h1>
      {renderCurrentStep()}
    </div>
  );
}
