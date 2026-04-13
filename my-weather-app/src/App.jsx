import { Routes, Route } from "react-router-dom";
import DisplayWeather from "./pages/Home.jsx";
import DisplayForecast from "./pages/Forecast.jsx";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<DisplayWeather />} />
        {/* <Route path="/forecast" element={<DisplayForecast />} /> */}
      </Routes>
  );
}