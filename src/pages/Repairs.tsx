import { RepairCard } from "@/components/custom/RepairCard";
import { RepairForm } from "@/components/custom/RepairForm";
import { Button } from "@/components/ui/button";
import { getAllRepairs, type RepairResponse } from "@/db";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export const Repairs = () => {
  const [repairs, setRepairs] = useState<RepairResponse[]>([]);

  async function getRepairs() {
    setRepairs([]);
    const res = await getAllRepairs();

    if (typeof res !== "string") {
      setRepairs(res || []);
    }
  }

  useEffect(() => {
    getRepairs();
  }, []);

  return (
    <div className="flex w-full h-full flex-col pt-2 pb-2 pl-4 pr-4 overflow-auto">
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Consertos
        </h1>
        <h3 className="text-md text-muted-foreground leading-5">
          Aqui você pode ver e criar novos consertos.
        </h3>
      </div>
      <div className="flex self-end gap-1 pt-3 pb-3">
        <Button
          onClick={() => {
            getRepairs();
          }}
        >
          Atualizar
          <RefreshCw></RefreshCw>
        </Button>
        <RepairForm />
      </div>

      {repairs.length > 0 &&
        repairs.map((r) => <RepairCard key={r.id} data={r} />)}
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
