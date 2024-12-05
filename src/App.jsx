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
import Leaderboard from "./pages/Leaderboard/Leaderboard.jsx";
import Stats from "./pages/Stats/Stats";
import { auth, db } from "./FirebaseConfig";
import { get, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import HelpButton from "./components/HelpButton";
import AdminConsole from "./pages/AdminConsole/AdminConsole.jsx";
import Bets from "./pages/Bets/Bets.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Store auth state
  const [isAdmin, setIsAdmin] = useState(null); // Admin state

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
  if (isLoggedIn === null || isAdmin === null) {
    return <p>Loading...</p>;
  }

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
                path="/helpdesk"
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
              <Route
                path="/adminConsole"
                element={
                  <ProtectedRoute>
                    <AdminConsole />
                  </ProtectedRoute>
                }
              />
              {/* Redirect "/" and "/home" to /adminMessage for admins */}
              <Route path="/" element={<Navigate to="/helpdesk" />} />
              <Route path="/home" element={<Navigate to="/helpdesk" />} />
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
                path="/matchDetails/:eventId"
                element={
                  <ProtectedRoute>
                    <Bets />
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
              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* Redirect admin-only routes to Home for non-admins */}
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}

          {/* Common route for all users */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
