import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const tokens = cookies().getAll();

  const hasAuthJsCookie = tokens.some((cookie) =>
    cookie.name.includes('access'),
  );

  const privatePaths = [
    '/dashboard',
    '/requests',
    '/requirements',
    '/trips',
    '/orders',
    '/profile',
    '/delete-account',
  ];

  if (
    !hasAuthJsCookie &&
    privatePaths.some((privatePath) => path.startsWith(privatePath))
  ) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}
