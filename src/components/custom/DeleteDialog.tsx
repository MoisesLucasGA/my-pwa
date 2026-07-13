import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type React from "react";
import { useState } from "react";

interface DeleteDialogProps {
  handleDelete: () => void;
  triggerTxt?: string;
  title?: string;
  subtitle?: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  handleDelete,
  triggerTxt = "Excluir",
  title = "Excluir dado",
  subtitle = "Tem certeza que deseja excluir?",
}: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handle = () => {
    handleDelete();
    handleOpen();
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen} variant={"destructive"}>
          {triggerTxt}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleOpen}>
              Cancelar
            </Button>
          </DialogClose>

          <Button onClick={handle}>Sim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
