import { useEffect } from "react";
import "./App.css";
import { initDB } from "./db.ts";
import PWABadge from "./PWABadge.tsx";
import { Router } from "./routes/Router.tsx";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <>
      <Router />
      <PWABadge />
      <Toaster />
    </>
  );
}

export default App;
