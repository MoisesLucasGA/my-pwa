import { deleteData, Stores, type Client } from "@/db";
import { getClientsThunk } from "@/redux/slices/ClientSlice";
import type { AppDispatch } from "@/redux/store";
import { UserRound } from "lucide-react";
import type React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ClientEdit } from "./ClientEdit";
import { DeleteDialog } from "./DeleteDialog";

export const ClientCard: React.FC<Client> = ({ id, name, phone }: Client) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = async () => {
    const res = await deleteData(Stores.Clients, id);

    if (typeof res === "boolean") {
      toast.info("Cliente excluído com sucesso!", { position: "top-center" });
      dispatch(getClientsThunk());
    } else {
      toast.error(res, { position: "top-center" });
    }
  };

  return (
    <div
      key={id}
      className="flex p-2 border rounded-md m-1 shadow justify-between"
    >
      <div className="flex flex-row items-center gap-2">
        <UserRound className="" />
        <div>
          <p className=" font-semibold break-all">{name}</p>
          <p className="text-sm text-muted-foreground">
            {phone || "Sem número"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-wrap justify-end">
        <ClientEdit data={{ id, name, phone }}></ClientEdit>
        <DeleteDialog
          title="Excluir Cliente"
          subtitle="Tem certeza que deseja excluir o cliente?"
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};
