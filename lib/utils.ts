import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatStatus = (status: string) => {
  // Convert from UPPER_SNAKE_CASE to Title Case (e.g., "REACHED_OUT" to "Reached Out")
  console.log(status);

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const URLexactStartMatch = (pathname: string, href: string) => {
  const singularize = (word: string) => {
    if (word.endsWith('s')) {
      return word.slice(0, -1);
    }
    return word;
  };

  const singularHref = singularize(href);
  console.log(singularHref);
  const regex = new RegExp(`^(${href}|${singularHref})(\\/|$)`);
  return regex.test(pathname);
};
