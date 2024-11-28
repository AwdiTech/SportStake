import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import MatchList from "./pages/MatchList/MatchList";
import AdminMessage from "./pages/Admin/adminMessage.jsx";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Profile from "./pages/Profile/Profile";
import Stats from "./pages/Stats/Stats";
import { auth, db } from "./FirebaseConfig";
import { get, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth"; // Import the auth state change listener
import HelpButton from "./components/HelpButton";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Store auth state
  const [isAdmin, setIsAdmin] = useState(false); // Admin state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
        // Fetch user details from Firebase
        const dbRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsAdmin(userData.isAdmin || false); // Determine admin status
        }
      } else {
        setIsLoggedIn(false); // User is logged out
        setIsAdmin(false);
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Show a loading state while the auth status is being determined
  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }
  // App routing
  // The `Router` component is the parent component that wraps the `Routes` and `Route` components.
  // The `Routes` component is a container for multiple `Route` components.
  // The `Route` component is used to define a route and its corresponding component.
  // Add more `Route` components to define more pages in the Single-Page-Application.
  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Navbar isAdmin={isAdmin} />}
        {!isAdmin && isLoggedIn && <HelpButton />}
        <Routes>
          {/* Admin routes */}
          {isAdmin && (
            <>
              <Route
                path="/adminMessage"
                element={
                  <ProtectedRoute>
                    <AdminMessage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                }
              />
              {/* Redirect non-admin routes to adminMessage for admins */}
              <Route path="*" element={<Navigate to="/adminMessage" />} />
            </>
          )}

          {/* Non-admin routes */}
          {!isAdmin && (
            <>
              <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matchList"
                element={
                  <ProtectedRoute>
                    <MatchList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Redirect admin-only routes to Home for non-admins */}
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
