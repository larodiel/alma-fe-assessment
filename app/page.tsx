import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import logo from '@/public/alma-logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-brand1 px-4">
      <Image src={logo} alt="Alma Logo" className="w-2xl mb-8" />
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link href="/assessment">
          <Button size="lg" variant="outline">Get Assessment</Button>
        </Link>
      </div>
    </main>
  );
}
