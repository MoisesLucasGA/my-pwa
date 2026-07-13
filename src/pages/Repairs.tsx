import { RepairCard } from "@/components/custom/RepairCard";
import { RepairForm } from "@/components/custom/RepairForm";
import { Button } from "@/components/ui/button";
import { getRepairsThunk } from "@/redux/slices/RepairSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Repairs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { repairs } = useSelector((state: RootState) => state.repair);

  useEffect(() => {
    if (repairs.length === 0) {
      dispatch(getRepairsThunk());
    }
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
        <Button onClick={() => dispatch(getRepairsThunk())}>
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
