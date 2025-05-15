'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLinkTypes = {
  activeClassName?: string;
  children?: React.ReactNode;
  href: string;
} & Omit<React.ComponentProps<typeof Link>, 'href'>;


export const NavLink: React.FC<NavLinkTypes & {isActive?: boolean}> = ({children, isActive, activeClassName, ...props }) => {
  const pathname = usePathname();
  let activeClasses = '';

  if (activeClassName) {
    activeClasses = activeClassName;
  }

  props.className = cn(props.className, {
    [activeClasses]: pathname === props?.href.toString() || isActive,
  });

  return (
    <Link {...props}>
      {children}
    </Link>
  );
}
