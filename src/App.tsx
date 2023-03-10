import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Neo from "./Neo";
import Apod from "./Apod";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="neo" element={<Neo />} />
          <Route path="apod" element={<Apod />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}