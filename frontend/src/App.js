import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { PlantProvider } from "./context/PlantContext";

function App() {
  return (
    <Router>
        <PlantProvider>
            <Routes>
            <Route path="/" element={<Home />} />
            </Routes>
        </PlantProvider>
    </Router>

  );
}

export default App;
