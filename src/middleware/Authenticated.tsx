import React, { ReactElement, useEffect, useState } from "react";
import { auth } from "../db/firebase";
import AuthButton from "../components/AuthButton";

interface AuthenticatedProps {
  children: ReactElement;
}

const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Make boolean of user
      setIsAuthenticated(!!user);
    });

    // Clean up the listener
    return () => {
      unsubscribe();
    };
  }, []);

  // If not value assigned yet
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <AuthButton />;
};

export default Authenticated;
