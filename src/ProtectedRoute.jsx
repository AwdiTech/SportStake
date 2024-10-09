import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirebaseConfig";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false after checking auth state
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading while checking the auth state
  if (loading) return <p>Loading...</p>;

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, show the protected component
  return children;
}
