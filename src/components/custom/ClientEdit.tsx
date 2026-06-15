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
import { ClientSchema, Stores, updateData, type Client } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface ClientEditProps {
  data: Client;
}

export const ClientEdit: React.FC<ClientEditProps> = ({
  data,
}: ClientEditProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    mode: "onSubmit",
    defaultValues: {
      ...data,
    },
  });

  const handleOpen = () => {
    setOpen(!open);
  };

  async function onSubmit(data: z.infer<typeof ClientSchema>) {
    const res = await updateData<Client>(Stores.Clients, {
      ...data,
    });
    if (typeof res === "string") {
      toast.error(res, { position: "top-center" });
    } else {
      toast.info("Cliente atualizado com sucesso!", {
        position: "top-center",
      });
      form.reset();
    }
    handleOpen();
  }

  return (
    <Dialog open={open}>
      <form
        id={`form-client-edit-${data.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DialogTrigger asChild>
          <Button onClick={handleOpen} variant={"outline"}>
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar Conserto</DialogTitle>
            <DialogDescription>
              Modifique o conserto preenchendo as informações abaixo
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
              <Button onClick={handleOpen} variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" form={`form-client-edit-${data.id}`}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
