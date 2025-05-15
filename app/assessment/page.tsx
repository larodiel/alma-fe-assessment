import { LeadForm } from '@/components/forms/lead/LeadForm';
import logo from '@/public/alma-logo.svg';
import headerImage from '@/public/header-image.jpg';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="">
      <div className="bg-brand1">
        <div className="flex gap-x-10 items-center py-10 px-4 md:px-0 md:py-0">
          <Image src={headerImage} alt="Header Image" className="h-full w-auto hidden md:block" priority />
          <div className="flex flex-col gap-y-5 md:gap-y-10 items-center md:items-start">
            <Image src={logo} alt="Alma Logo" className="h-5 w-auto" />
            <h1 className="text-3xl text-center md:text-left md:text-5xl font-bold max-w-[485px]">Get an assessment of your immigration case</h1>
          </div>
        </div>
      </div>
      <LeadForm />
    </main>
  );
}
