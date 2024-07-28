import type { NextAuthConfig } from 'next-auth';
import { redirect } from 'next/navigation';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ auth, request }) => {      
      
      // Logged in users are authenticated, otherwise redirect to login page
      /*
      const ifLoggedIn = !!auth;
      if(ifLoggedIn && request.nextUrl.pathname.includes('login')){
        const newUrl = new URL("/dashboard", request.nextUrl.origin);
        return Response.redirect(newUrl)
      }
      console.log('request '+JSON.stringify(request.nextUrl));
      */
      return !(!auth)
    },
    /*
    authorized({ auth, request:{nextUrl} }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); 
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
        //return Response.redirect(new URL('/login', nextUrl));
      } else if (isLoggedIn && (nextUrl.pathname.includes('/dashboard') ||nextUrl.pathname.includes('/login') ) ) {
        //comment this out to have seperate segment route 
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }else if(!isLoggedIn){
        //return Response.redirect(new URL('/login', nextUrl.origin));
        return false
      }
      
      return true;
      */

  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;