import { API_URL } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

type Unit = {
  id: number;
  words_count: number;
  name: string;
  audio: string;
  course: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { courseId } = context.query;
  const token = context.req.cookies.token; // assuming the token is stored in cookies

  let units: Unit[] | null = null;

  try {
    const response = await fetch(`${API_URL}/lesson/course/${courseId}/units/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    units = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      units,
    },
  };
}

const Units = ({ units }: { units: Unit[] }) => {
  const router = useRouter();
  const { courseId } = router.query;

  return (
    <div>
      <h1 className='H1'>Units</h1>
      <ul className='grid gap-4' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(15rem , 100%), 1fr ))' }}>
        {units.map((unit: any) => {
          return (
            <li key={unit.id}>
              <Link
                href={`/courses/${courseId}/${unit.id}`}
                className='block grid gap-4 border border-slate5 p-4 rounded-lg bg-slate3 hover:bg-accent5 hover:border-accent8 transition duration-100 ease-in-out transform hover:scale-102 shadow'
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(15rem, 100%), 1fr))' }}
              >
                <div className='flex justify-between p-4 w-full rounded-lg'>
                  <div>
                    <h2 className='H2'>{unit.name}</h2>
                    <p>{unit.description}</p>
                    <p>{unit.words_count} Words</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Units;
