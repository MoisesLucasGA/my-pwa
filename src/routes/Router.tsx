import { Clients } from "@/pages/Clients";
import { Home } from "@/pages/Home";
import { Repairs } from "@/pages/Repairs";
import { BrowserRouter, Route, Routes } from "react-router";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/repairs" element={<Repairs />} />
      </Routes>
    </BrowserRouter>
  );
};
