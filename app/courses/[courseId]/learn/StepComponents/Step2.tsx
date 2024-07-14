import { FC, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import { keyframes } from '@stitches/react';

interface Step2Props {
  word: {
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
  courseId: string;
}

const supabase = createClient();

const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(1.2)', opacity: 0.8 },
});

const Step2: FC<Step2Props> = ({ word, onAnswer, courseId }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchOtherDefinitions = async () => {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('word, definitions, units!inner(course_id)')
          .filter('units.course_id', 'eq', courseId)
          .neq('word', word.word)
          .limit(3);

        if (error) {
          console.error('Error fetching other definitions:', error);
          return;
        }

        const otherDefinitions = data.map((w: { definitions: string[] }) => w.definitions.join('; '));
        const incorrectDefinitions = otherDefinitions.sort(() => 0.5 - Math.random());
        const allOptions = [...incorrectDefinitions, word.definitions.join('; ')];
        setOptions(allOptions.sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error('Error fetching other definitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherDefinitions();
  }, [courseId, word]);

  const handleAnswer = (selectedOption: string) => {
    onAnswer(selectedOption === word.definitions.join('; '));
  };

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <span>{word.word}</span>
          <button onClick={handlePlayAudio} className="text-blue-500 hover:text-blue-700 focus:outline-none">
            <SpeakerLoudIcon
              className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`}
              style={isSpeaking ? { animation: `${pulse} 1s infinite` } : {}}
            />
          </button>
        </CardTitle>
        <CardDescription>
          Choose the correct definition for the word "{word.word}".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswer(option)}
              className="w-full text-left py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2;