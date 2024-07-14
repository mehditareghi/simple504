'use client';
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Step7Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step7: React.FC<Step7Props> = ({ word, onAnswer }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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

  return (
    <div>
      <p className='mb-2 text-xl font-bold'>Microphone: {listening ? 'Listening to your voice..' : 'off'}</p>

      <h2>Pronounce the word: {word.word}</h2>
      <div className='flex gap-3'>
        <button className='btn btn-primary btn-sm' onClick={SpeechRecognition.startListening}>
          Start
        </button>
        <button className='btn btn-secondary btn-sm' onClick={SpeechRecognition.stopListening}>
          Stop
        </button>
        <button className='btn btn-accent btn-sm' onClick={resetTranscript}>
          Reset
        </button>
      </div>
      <p>Spoken word: {transcript.toLowerCase().trim()}</p>
      <button onClick={handleSubmit} className='btn btn-success btn-sm mt-4'>
        Submit
      </button>
    </div>
  );
};

export default Step7;
