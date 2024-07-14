import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { keyframes } from '@stitches/react';

interface Step1Props {
  word: {
    word: string;
    definitions: string[];
    examples: string[];
  };
  onNext: () => void;
}

const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(1.2)', opacity: 0.8 },
});

const Step1: FC<Step1Props> = ({ word, onNext }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    speechSynthesis.speak(utterance);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center space-x-2">
            <span>{word.word}</span>
            <button onClick={handlePlayAudio} className="text-blue-500 hover:text-blue-700 focus:outline-none">
              <SpeakerLoudIcon
                className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`}
                style={isSpeaking ? { animation: `${pulse} 1s infinite` } : {}}
              />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <CardDescription className='font-bold'>Definitions:</CardDescription>
            <ul className='list-disc list-inside'>
              {word.definitions.map((def) => (
                <li key={def}>{def}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <CardDescription className='font-bold'>Examples:</CardDescription>
            <ul className='list-disc list-inside'>
              {word.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <Button onClick={onNext} className='w-full'>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1;