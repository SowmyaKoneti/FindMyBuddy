import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  apiKey: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API, // Ensure this matches your environment variable
}); 

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


// const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/user-details(.*)','/maps(.*)', '/friends(.*)', '/chats(.*)'])

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect()
// })

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run for API routes but specifically exclude certain routes like sign-in, sign-up, and user-details
    '/(api|trpc)(.*)',

    // Exclude authentication-related paths by including specific patterns to skip
    // Adjusting the paths to ensure correct matching
    // Using RegExp to correctly exclude certain paths
    '/((?!sign-in|sign-up|user-details).*)',
  ],
};
