import { ClientCard } from "@/components/custom/ClientCard";
import { ClientForm } from "@/components/custom/ClientForm";
import { Button } from "@/components/ui/button";
import { getClientsThunk } from "@/redux/slices/ClientSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Clients = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients } = useSelector((state: RootState) => state.client);

  useEffect(() => {
    if (clients.length === 0) {
      dispatch(getClientsThunk());
    }
  }, []);

  return (
    <div className="flex w-full h-full flex-col pt-2 pb-2 pl-4 pr-4 overflow-auto">
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Clientes
        </h1>
        <h3 className="text-md text-muted-foreground leading-5">
          Aqui você pode ver todos os clientes e cadastrar novos clientes.
        </h3>
      </div>
      <div className="flex self-end gap-1 pt-3 pb-3">
        <Button onClick={() => dispatch(getClientsThunk())}>
          Atualizar
          <RefreshCw></RefreshCw>
        </Button>
        <ClientForm />
      </div>

      {clients.map((c) => (
        <ClientCard
          key={c.id}
          id={c.id}
          name={c.name}
          phone={c.phone}
        ></ClientCard>
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
