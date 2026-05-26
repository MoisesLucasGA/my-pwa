import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import appLogo from "/favicon.ico";
import PWABadge from "./PWABadge.tsx";
import "./App.css";
import {
  Stores,
  addData,
  getRepair,
  initDB,
  type Client,
  type Repair,
  type RepairResponse,
} from "./db.ts";
import { NavLink } from "react-router";
import { Button } from "./components/ui/button.tsx";

interface BeforeInstallPromptEvent extends Event {
  prompt?: () => Promise<any>;
}

function App() {
  const [count, setCount] = useState(0);
  const [repairs, setRepairs] = useState(null as unknown as RepairResponse);

  const handleSave = () => {
    addData<Omit<Client, "id">>(Stores.Clients, {
      name: "Maria",
      phone: "22",
    });
  };

  const handleSaveRepair = () => {
    addData<Omit<Repair, "id">>(Stores.Repairs, {
      desc: "Desc",
      clientId: 1,
      price: 10,
      isPaid: 1,
      createdAt: new Date(),
      isDelivered: 0,
      deliveredAt: null,
      paidAt: null,
    });
  };

  const handleGet = async () => {
    const x = await getRepair(2);

    if (x && typeof x !== "string") {
      setRepairs(x);
    }

    console.log(x);
    console.log(x === null);
  };

  window.addEventListener("beforeinstallprompt", (event: Event) => {
    event.preventDefault();
    const installButton = document.querySelector("#install");
    const installPrompt: BeforeInstallPromptEvent = event;
    installButton?.removeAttribute("hidden");

    installButton?.addEventListener("click", async () => {
      if (!installPrompt.prompt) {
        return;
      }
      const result = await installPrompt.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      installButton.setAttribute("hidden", "");
    });
  });

  useEffect(() => {
    initDB();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={appLogo} className="logo" alt="my-pwa logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>my-pwa</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <Button onClick={handleSave}>Save Client</Button>
        <Button onClick={handleSaveRepair}>Save repair</Button>
        <Button onClick={handleGet}>GetAll</Button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <NavLink to="/about" end>
        About
      </NavLink>

      <Button id="install" hidden>
        Install
      </Button>

      {repairs && (
        <div key={repairs.repair.id}>
          <p>{repairs.client?.name}</p>
          <p>{repairs.repair.desc}</p>
        </div>
      )}

      <PWABadge />
    </>
  );
}

export default App;
