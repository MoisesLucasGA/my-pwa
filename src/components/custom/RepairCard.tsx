import type { RepairResponse } from "@/db";
import type React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { RepairEdit } from "./RepairEdit";
import { format } from "date-fns";

interface RepairCardProps {
  data: RepairResponse;
}

export const RepairCard: React.FC<RepairCardProps> = ({
  data,
}: RepairCardProps) => {
  return (
    <div className="flex flex-col p-2 border rounded-md m-1 shadow justify-between">
      <div className="flex flex-col">
        <div className="flex gap-2 justify-between">
          <p className="font-bold break-all text-lg">{data.clientName}</p>
          <p className="font-bold text-xl">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(data.price || 0)}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("pt-BR").format(data.createdAt)}
        </p>
        <div>
          <p className="pt-2 wrap-break-word text-justify">{data.desc}</p>
        </div>
      </div>
      <div className="flex items-end gap-1 flex-wrap justify-between">
        <div className="flex flex-col gap-1">
          {data.isPaid === 1 ? (
            <Badge className="bg-green-50 text-green-700 " variant={"outline"}>
              Pago
              {data?.paidAt ? `: ${format(data.paidAt, "dd/MM/yyyy")}` : ""}
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 " variant={"outline"}>
              Não Pago
            </Badge>
          )}

          {data.isDelivered === 1 ? (
            <Badge className="bg-green-50 text-green-700 " variant={"outline"}>
              Entregue
              {data?.deliveredAt
                ? `: ${format(data.deliveredAt, "dd/MM/yyyy")}`
                : ""}
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 " variant={"outline"}>
              Não Entregue
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <RepairEdit data={data}></RepairEdit>
          <Button variant={"destructive"}>Excluir</Button>
        </div>
      </div>
    </div>
  );
};
