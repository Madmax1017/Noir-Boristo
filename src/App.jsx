import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Pages/Home/components/Navbar";
import Home from "./Pages/Home/Home"; // Your full home page component
import MenuSection from "./Pages/Menu/MenuSection"; // Your MenuSection file

export default function App() {
  return (
    <Router>
      {/* Navbar stays visible across all pages */}
      <Navbar />

      <Routes>
        {/* Homepage route */}
        <Route path="/" element={<Home />} />

        {/* Separate full Menu page route */}
        <Route path="/full-menu" element={<MenuSection topOffset={80} />} />
      </Routes>
    </Router>
  );
}