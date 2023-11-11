import Link from 'next/link';

export default function Header() {
  return (
    <header className='flex flex-wrap justify-around p-4 bg-gray-100'>
      {Array.from({ length: 12 }, (_, i) => (
        <Link key={i} href={`/lesson${i + 1}`} className='m-2 px-2 py-1 text-sm text-orange-500 rounded-lg hover:text-orange-600 active:text-orange-700'>
          Lesson {i + 1}
        </Link>
      ))}
    </header>
  );
}
