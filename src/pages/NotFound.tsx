import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 safe-area-top safe-area-bottom no-scroll-x">
      <div className="text-center w-full max-w-md">
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold">404</h1>
        <p className="mb-6 text-lg sm:text-xl text-muted-foreground text-wrap-safe">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-primary underline hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm touch-target"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
