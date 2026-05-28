import { ClientCard } from "@/components/custom/ClientCard";
import { ClientForm } from "@/components/custom/ClientForm";
import { Button } from "@/components/ui/button";
import { getAllData, Stores, type Client } from "@/db";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  async function getClients() {
    setClients([]);
    const res = await getAllData<Client>(Stores.Clients);

    if (typeof res !== "string") {
      setClients(res || []);
    }
  }

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Clientes
        </h1>
        <h3 className="text-md text-muted-foreground leading-5">
          Aqui você pode ver todos os clientes e cadastrar novos clientes.
        </h3>
      </div>
      <div className="flex self-end gap-1 pt-3 pb-3">
        <Button
          onClick={() => {
            getClients();
          }}
        >
          <RefreshCw></RefreshCw>
        </Button>
        <ClientForm />
      </div>

      {clients.length > 0 &&
        clients.map((c) => (
          <ClientCard id={c.id} name={c.name} phone={c.phone}></ClientCard>
        ))}
      <Button
        variant={"outline"}
        onClick={() => {
          navigation.back();
        }}
      >
        Voltar
      </Button>
    </div>
  );
};
