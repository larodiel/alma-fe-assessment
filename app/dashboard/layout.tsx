import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/ui/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getCurrentUser } from '@/lib/auth';
import logo from '@/public/alma-logo.svg';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider defaultOpen className="flex min-h-screen relative">
      <Sidebar className="flex">
        <div className="hidden md:block blur-3xl bg-brand1 absolute -top-10 -left-10 size-60 rounded-full z-20"></div>
        <SidebarHeader className="px-6 pt-8 md:pb-24 pb-10 relative z-30">
          <Image src={logo} alt="Logo" className="w-32" />
        </SidebarHeader>
        <SidebarContent className="px-6 relative z-30">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink href="/dashboard" activeClassName="font-bold" className="flex items-center gap-x-1.5 text-lg">
                Dashboard
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink
                href="/dashboard/leads"
                activeClassName="font-bold"
                className="flex items-center gap-x-1.5 text-lg">
                Leads
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink
                href="/dashboard/settings"
                activeClassName="font-bold"
                className="flex items-center gap-x-1.5 text-lg">
                Settings
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center">
            <Avatar className="size-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="text-lg font-bold">{user?.name}</p>
            </div>
          </div>
          <Link href="/api/auth/signout">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 flex flex-col relative z-30">
        <SidebarTrigger />
        <main className="flex-1 container mx-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
