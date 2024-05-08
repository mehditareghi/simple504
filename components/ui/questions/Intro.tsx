import { PlayCircle } from 'phosphor-react';
import Image from 'next/image';
import { Question } from '@/types';

const Intro = ({ data }: { data: Question }) => {
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
    <div className='flex jc ac rounded-xl bg-accent2 shadow w-full md:w-[50%] mx-auto p-4'>
      <div>
        <div className=''>
          <h2 className='H2 text-center'>{data.words[0].word}</h2>
        </div>
        <div className=''>
          <div>
            <div className='flex items-center'>
              <strong className='c-accent11'>US:</strong>
              <button
                onClick={() => speakUS(data.words[0].word)}
                className='flex items-center justify-center text-lg ml-1'
              >
                <PlayCircle weight='fill' />
              </button>
            </div>
            <div className='flex items-center'>
              <strong className='c-accent11'>UK:</strong>
              <button
                onClick={() => speakUK(data.words[0].word)}
                className='flex items-center justify-center text-lg ml-1'
              >
                <PlayCircle weight='fill' />
              </button>
            </div>

            <p>
              <strong className='c-accent11'>Part of Speech:</strong>{' '}
              {Array.isArray(data.words[0].part_of_speech)
                ? data.words[0].part_of_speech.join(', ')
                : data.words[0].part_of_speech}
            </p>
            {data.words[0].noun.length > 0 && (
              <p>
                <strong className='c-accent11'>Noun:</strong> {data.words[0].noun.join(', ')}
              </p>
            )}
            {data.words[0].verb && data.words[0].verb.length > 0 && (
              <p>
                <strong className='c-accent11'>Verb:</strong> {data.words[0].verb.join(', ')}
              </p>
            )}
            {data.words[0].adjective.length > 0 && (
              <p>
                <strong className='c-accent11'>Adjective:</strong> {data.words[0].adjective.join(', ')}
              </p>
            )}
            {data.words[0].adverb && data.words[0].adverb.length > 0 && (
              <p>
                <strong className='c-accent11'>Adverb:</strong> {data.words[0].adverb.join(', ')}
              </p>
            )}
            <p>
              <strong className='c-accent11'>Definition:</strong>{' '}
              {Array.isArray(data.words[0].definition) ? data.words[0].definition.join(', ') : data.words[0].definition}
            </p>
            {data.words[0].examples && data.words[0].examples.length > 0 && (
              <p>
                <strong className='c-accent11'>Examples:</strong> {data.words[0].examples}
              </p>
            )}
            {data.words[0].note && data.words[0].note.length > 0 && (
              <p>
                <strong className='c-accent11'>Note:</strong> {data.words[0].note.join(', ')}
              </p>
            )}
          </div>
          {data.words[0].image && (
            <div>
              <Image
                src={`${data.words[0].image}`}
                alt={data.words[0].word}
                width={300}
                height={200}
                className='rounded-lg w-full h-auto object-contain shadow'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
