import "./App.css";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  
  // App routing
  // The `Router` component is the parent component that wraps the `Routes` and `Route` components.
  // The `Routes` component is a container for multiple `Route` components.
  // The `Route` component is used to define a route and its corresponding component.
  // Add more `Route` components to define more pages in the Single-Page-Application.
  return (
    
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          {/* Add a Default route landing page later - <Route path="/" element={<Landing />} /> */}
          {/* Add a default not found page route later <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
