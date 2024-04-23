import { API_URL } from '@/utils/constants';
import Image from 'next/image';
import { PlayCircle } from 'phosphor-react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, words.length - 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };
  const word = words[currentPage];
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
      <h1 className='H1'>Words</h1>
      {word && (
        <div className='flex jc ac rounded-xl bg-accent2 shadow w-full md:w-[50%] mx-auto p-4'>
          <div>
            <div className=''>
              <h2 className='H2 text-center'>{word.word}</h2>
            </div>
            <div className=''>
              <div>
                <div className='flex items-center'>
                  <strong className='c-accent11'>US:</strong>
                  <button onClick={() => speakUS(word.word)} className='flex items-center justify-center text-lg ml-1'>
                    <PlayCircle weight='fill' />
                  </button>
                </div>
                <div className='flex items-center'>
                  <strong className='c-accent11'>UK:</strong>
                  <button onClick={() => speakUK(word.word)} className='flex items-center justify-center text-lg ml-1'>
                    <PlayCircle weight='fill' />
                  </button>
                </div>

                <p>
                  <strong className='c-accent11'>Part of Speech:</strong>{' '}
                  {Array.isArray(word.partOfSpeech) ? word.partOfSpeech.join(', ') : word.partOfSpeech}
                </p>
                {word.noun.length > 0 && (
                  <p>
                    <strong className='c-accent11'>Noun:</strong> {word.noun.join(', ')}
                  </p>
                )}
                {word.verb && word.verb.length > 0 && (
                  <p>
                    <strong className='c-accent11'>Verb:</strong> {word.verb.join(', ')}
                  </p>
                )}
                {word.adjective.length > 0 && (
                  <p>
                    <strong className='c-accent11'>Adjective:</strong> {word.adjective.join(', ')}
                  </p>
                )}
                {word.adverb && word.adverb.length > 0 && (
                  <p>
                    <strong className='c-accent11'>Adverb:</strong> {word.adverb.join(', ')}
                  </p>
                )}
                <p>
                  <strong className='c-accent11'>Definition:</strong>{' '}
                  {Array.isArray(word.definition) ? word.definition.join(', ') : word.definition}
                </p>
                {word.examples && word.examples.length > 0 && (
                  <p>
                    <strong className='c-accent11'>Examples:</strong> {word.examples}
                  </p>
                )}
                {word.note && word.note.length > 0 && (
                  <p>
                    <strong className='c-accent11'>Note:</strong> {word.note.join(', ')}
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
          </div>
        </div>
      )}
      <div className='text-center'>
        <button onClick={prevPage} disabled={currentPage === 0} className='btn-prm'>
          Previous
        </button>
        <span>
          {currentPage + 1} of {words.length}
        </span>
        <button onClick={nextPage} disabled={currentPage === words.length - 1} className='btn-prm'>
          Next
        </button>
      </div>
    </div>
  );
};

export default Words;
