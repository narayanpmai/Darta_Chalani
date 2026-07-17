import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['en', 'ne'],
  defaultLocale: 'ne'
});
 
// Lightweight wrappers around Next.js' navigation APIs
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
