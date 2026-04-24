import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ButtonPage from "./pages/ButtonPage";
import PillPage from "./pages/PillPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/button" element={<ButtonPage />} />
      <Route path="/pill" element={<PillPage />} />
    </Routes>
  );
}
