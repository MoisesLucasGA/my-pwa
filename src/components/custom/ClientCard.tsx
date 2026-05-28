import type React from "react";
import { Button } from "../ui/button";
import type { Client } from "@/db";
import { UserRound } from "lucide-react";

export const ClientCard: React.FC<Client> = ({ id, name, phone }: Client) => {
  return (
    <div
      key={id}
      className="flex p-2 border rounded-md m-1 shadow justify-between"
    >
      <div className="flex flex-row items-center gap-2">
        <UserRound className="" />
        <div>
          <p className=" font-semibold break-all">{name}</p>
          <p className="text-sm text-muted-foreground"> {phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-wrap justify-end">
        <Button variant={"outline"}>Editar</Button>
        <Button variant={"destructive"}>Excluir</Button>
      </div>
    </div>
  );
};
