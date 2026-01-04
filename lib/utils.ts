import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Formats a date to DD/MM/YYYY.
 */
export const formatDate = (date: Date | string | number) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
