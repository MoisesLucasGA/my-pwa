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
import { UserPlus2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { addData, ClientSchema, Stores, type Client } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const ClientForm = () => {
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
    }
  }

  return (
    <Dialog>
      <form id="form-clients" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button>
            Novo Cliente <UserPlus2></UserPlus2>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
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
                  <FieldLabel htmlFor="form-clients-phone">Telefone</FieldLabel>
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
              <Button variant="outline">Cancelar</Button>
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
