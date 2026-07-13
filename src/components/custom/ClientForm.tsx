import { Button } from "@/components/ui/button";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addData, ClientSchema, Stores, type Client } from "@/db";
import { getClientsThunk } from "@/redux/slices/ClientSlice";
import type { AppDispatch } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";

export const ClientForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    mode: "onSubmit",
    defaultValues: {
      id: 1,
      name: "",
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ClientSchema>) {
    const res = await addData<Omit<Client, "id">>(Stores.Clients, {
      name: data.name,
      phone: data.phone,
    });

    if (typeof res === "string") {
      toast.error(res, { position: "top-center" });
    } else {
      toast.info("Cliente cadastrado com sucesso!", { position: "top-center" });
      form.reset();
      handleOpen();
      dispatch(getClientsThunk());
    }
  }

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open}>
      <form id="form-clients" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button onClick={handleOpen}>
            Novo Cliente <UserPlus2></UserPlus2>
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Cadastre um novo cliente preenchendo as informações abaixo
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-clients-name">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="form-clients-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite aqui"
                    autoComplete="off"
                    maxLength={150}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-clients-phone">
                    Telefone (Opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-clients-phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="(XX) X XXXX-XXXX"
                    autoComplete="off"
                    maxLength={16}
                    inputMode="numeric"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value
                          .replace(/\D/g, "")
                          .replace(
                            /^(\d{2})(\d{1})(\d{4})(\d{4})$/g,
                            "($1) $2 $3-$4",
                          )
                          .trim(),
                      );
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleOpen}>
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" form="form-clients">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
