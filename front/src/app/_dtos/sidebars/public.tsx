import Link from 'next/link';

export const publicItems: any[] = [
  {
    key: 'home',
    label: <Link href="/">Home</Link>,
  },
  {
    key: 'board',
    label: <Link href="/search/send">Connect Hub</Link>,
  },
  {
    key: 'about',
    label: <Link href="/about-us">About us</Link>,
  },
  {
    key: 'contact',
    label: <Link href="/contact">Contact us</Link>,
  },
  {
    key: 'security',
    label: <Link href="/security">Security</Link>,
  },
  {
    key: 'faq',
    label: <Link href="/faq">FAQ</Link>,
  },
];
