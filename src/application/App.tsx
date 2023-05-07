import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/Home";
import Neo from "../neos/components/Neos";
import Apod from "../apod/components/Apod";
import Mrp from "../mrp/components/Mrp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="neo" element={<Neo />} />
          <Route path="apod" element={<Apod />} />
          <Route path="mrp" element={<Mrp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}