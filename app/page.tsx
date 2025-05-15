import logo from '@/public/alma-logo.svg';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-brand1 px-4">
       <Image src={logo} alt="Alma Logo" className="w-2xl" />
    </main>
  );
}
