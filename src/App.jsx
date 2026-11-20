import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Pages/Home/components/Navbar";
import Home from "./Pages/Home/Home"; // Your full home page component
import MenuSection from "./Pages/Menu/MenuSection"; // Your MenuSection file

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
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