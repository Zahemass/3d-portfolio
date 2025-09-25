import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

// Components
import Loader from "./components/Loader";
import IntroScene from "./components/IntroScene";
import SpaceGame from "./components/SpaceGame";



const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Dark mode default
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    // ✅ Fake loading screen (3s)
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [darkMode]);

  return (
    <>
      <AnimatePresence>
        {loading ? (
          <Loader key="loader" />
        ) : (
          <>
            
            {/* Optional cinematic intro */}
            <IntroScene />

            {/* 🚀 Space Journey */}
            <SpaceGame darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Toast Notifications */}
            <Toaster />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
