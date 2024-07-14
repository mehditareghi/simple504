import { FC, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Step4Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
  courseId: string;
}

const supabase = createClient();

const Step4: FC<Step4Props> = ({ word, onAnswer, courseId }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtherWords = async () => {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('word, units!inner(course_id)')
          .filter('units.course_id', 'eq', courseId)
          .neq('word', word.word)
          .limit(3);

        if (error) {
          console.error('Error fetching other words:', error);
          return;
        }

        const otherWords = data.map((w: { word: string }) => w.word);
        const allOptions = [...otherWords, word.word];
        setOptions(allOptions.sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error('Error fetching other words:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherWords();
  }, [courseId, word]);

  const selectExample = (examples: string[], word: string): string => {
    for (let example of examples) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(example)) {
        return example.replace(word, '______');
      }
    }
    return examples[0].replace(word, '______');
  };

  const example = selectExample(word.examples, word.word);

  const handleAnswer = (selectedOption: string) => {
    onAnswer(selectedOption === word.word);
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
          <span>Complete the Sentence</span>
        </CardTitle>
        <CardDescription>Select the correct word to complete the sentence.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg">{example}</p>
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

export default Step4;