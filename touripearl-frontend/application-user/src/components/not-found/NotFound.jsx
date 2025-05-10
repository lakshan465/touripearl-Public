import { UserX, Home } from 'lucide-react';
import {useNavigate} from "react-router-dom";

export function UserNotFound() {
  const navigate= useNavigate();
  return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-light/30 to-white rounded-lg">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-accent/20 blur-lg"></div>
          <div className="relative bg-white p-4 rounded-full shadow-lg">
            <UserX size={48} className="text-primary" />
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-primary">Page Not Found</h1>

        <p className="mt-4 text-lg text-secondary text-center max-w-md">
          We couldn&#39;t find the user you&#39;re looking for
        </p>

        <button
            onClick={()=>navigate("/")}
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-highlight hover:bg-highlight/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors duration-200"
        >
          <Home className="mr-2 h-5 w-5" />
          Return Home
        </button>

        <div className="mt-12 text-sm text-accent">
          Error Code: 404
        </div>
      </div>
  );
}