// import { NextResponse } from 'next/server';
// import { routing } from './i18n/routing';

// export default function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Serve the default locale's content on `/` without redirecting
//   if (pathname === '/') {
//     const url = req.nextUrl.clone();
//     url.pathname = `/`; // Treat `/` as `/en`
//     return NextResponse.rewrite(url); // Rewrite to the default locale
//   }

//   // Let next-intl handle locale-specific paths
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/', '/(en|ar|fr|es|pt|zh)/:path*'],
// };


// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   // Match all paths with the supported locales
//   matcher: ['/', '/(en|ar|fr|es|pt|zh)/:path*'],
// };


import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';

export function middleware(request) {
  return i18nRouter(request, i18nConfig);
}

// applies this middleware only to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};