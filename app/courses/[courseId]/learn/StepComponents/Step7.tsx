'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { keyframes } from '@stitches/react';

interface Step7Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(1.2)', opacity: 0.8 },
});

const Step7: FC<Step7Props> = ({ word, onAnswer }) => {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleSubmit = () => {
    if (transcript.toLowerCase().trim() === word.word.toLowerCase()) {
      onAnswer(true);
    } else {
      onAnswer(false);
    }
  };

  const handleMouseDown = () => {
    SpeechRecognition.startListening();
  };

  const handleMouseUp = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Pronounce the word: {word.word}
        </CardTitle>
        <CardDescription>Hold the button below and pronounce the word clearly.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-center">
          <Button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex items-center gap-2 ${listening ? 'animate-pulse' : ''}`}
            style={listening ? { animation: `${pulse} 1s infinite` } : {}}
          >
            <SpeakerLoudIcon className="w-5 h-5" />
            {listening ? 'Listening...' : 'Hold to Pronounce'}
          </Button>
        </div>
        <p className="mt-4">Spoken word: <span className="font-bold">{transcript.toLowerCase().trim()}</span></p>
        <Button onClick={handleSubmit} className="w-full mt-4">
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step7;