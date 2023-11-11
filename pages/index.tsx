import Image from 'next/image';
import Link from 'next/link';



const units = [
  { id: 1, title: 'Unit 1' },
  { id: 2, title: 'Unit 2' },
  { id: 3, title: 'Unit 3' },
  { id: 4, title: 'Unit 4' },
  { id: 5, title: 'Unit 5' },
  { id: 6, title: 'Unit 6' },
  { id: 7, title: 'Unit 7' },
  { id: 8, title: 'Unit 8' },
  { id: 9, title: 'Unit 9' },
  { id: 10, title: 'Unit 10' },
  { id: 11, title: 'Unit 11' },
  { id: 12, title: 'Unit 12' },
];

export default function Home() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-center text-orange-500 mb-4'>504 Essential Words</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {units.map((unit) => (
          <Link
            href={`/unit${unit.id}`}
            key={unit.id}
            className='border border-orange-500 rounded-lg p-4 hover:bg-orange-50 transition-colors'
          >
            <h2 className='text-orange-500 text-lg'>{unit.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};
