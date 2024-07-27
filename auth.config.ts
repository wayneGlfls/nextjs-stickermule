import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && (nextUrl.pathname == '/dashboard' || nextUrl.pathname.includes('/login') ) ) {
        //comment this out to have seperate segment route 
        return Response.redirect(new URL('/dashboard', nextUrl));
      } else if(!isLoggedIn){
        return false;
      }
      return true;
      
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;