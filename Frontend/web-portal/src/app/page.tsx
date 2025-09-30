import { redirect } from 'next/navigation';
import type {NextPage} from 'next';

const Home: NextPage = () => {
  redirect('/dashboard');
  return null;
};

export default Home;
