import { API_URL } from '@/utils/constants';
import Image from 'next/image';
import { PlayCircle } from 'phosphor-react';
import { GetServerSidePropsContext } from 'next';

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
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { unitId } = context.query;
  const token = context.req.cookies.token; // assuming the token is stored in cookies

  let words: Word[] | null = null;

  try {
    const response = await fetch(`${API_URL}/lesson/unit/${unitId}/words/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    words = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      words,
    },
  };
}

const Words = ({ words }: { words: Word[] }) => {
  const speakUS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find((voice) => voice.lang === 'en-US');
    if (usVoice) utterance.voice = usVoice;
    window.speechSynthesis.speak(utterance);
  };

  const speakUK = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find((voice) => voice.lang === 'en-GB');
    if (ukVoice) utterance.voice = ukVoice;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div>
      <h1>Words</h1>
      {words.map((word: any, index: number) => (
        <details key={index} className='mb-4'>
          <summary className='flex items-center font-medium summary'>
            <p className='mr-2 px-4 py-2 rounded-lg bg-gray-100 text-orange-500'>{index + 1}</p>
            <p className='bg-gray-100 px-4 py-2 rounded-lg w-full'>{word.word}</p>
          </summary>
          <div className='pl-4 bg-orange-50 rounded-lg px-4 py-2 mt-2 flex flex-col md:flex-row gap-4 justify-between'>
            <div>
              <div className='flex items-center'>
                <strong className='text-orange-500'>US:</strong>
                <button onClick={() => speakUS(word.word)} className='flex items-center justify-center text-lg ml-1'>
                  <PlayCircle weight='fill' />
                </button>
              </div>
              <div className='flex items-center'>
                <strong className='text-orange-500'>UK:</strong>
                <button onClick={() => speakUK(word.word)} className='flex items-center justify-center text-lg ml-1'>
                  <PlayCircle weight='fill' />
                </button>
              </div>

              <p>
                <strong className='text-orange-500'>Part of Speech:</strong>{' '}
                {Array.isArray(word.partOfSpeech) ? word.partOfSpeech.join(', ') : word.partOfSpeech}
              </p>
              {word.noun.length > 0 && (
                <p>
                  <strong className='text-orange-500'>Noun:</strong> {word.noun.join(', ')}
                </p>
              )}
              {word.verb && word.verb.length > 0 && (
                <p>
                  <strong className='text-orange-500'>Verb:</strong> {word.verb.join(', ')}
                </p>
              )}
              {word.adjective.length > 0 && (
                <p>
                  <strong className='text-orange-500'>Adjective:</strong> {word.adjective.join(', ')}
                </p>
              )}
              {word.adverb && word.adverb.length > 0 && (
                <p>
                  <strong className='text-orange-500'>Adverb:</strong> {word.adverb.join(', ')}
                </p>
              )}
              <p>
                <strong className='text-orange-500'>Definition:</strong>{' '}
                {Array.isArray(word.definition) ? word.definition.join(', ') : word.definition}
              </p>
              <p>
                <strong className='text-orange-500'>Example:</strong>
              </p>
              {word.examples && word.examples.length > 0 && (
                <p>
                  <strong className='text-orange-500'>Examples:</strong> {word.examples}
                </p>
              )}
              {word.note && word.note.length > 0 && (
                <p>
                  <strong className='text-orange-500'>Note:</strong> {word.note.join(', ')}
                </p>
              )}
            </div>
            {word.image && (
              <div>
                <Image
                  src={`${word.image}`}
                  alt={word.word}
                  width={300}
                  height={200}
                  className='rounded-lg w-full h-auto object-contain shadow'
                />
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export default Words;
