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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addData, RepairSchema, Stores, type Repair } from "@/db";
import { getClientsThunk } from "@/redux/slices/ClientSlice";
import { getRepairsThunk } from "@/redux/slices/RepairSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

export const RepairForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients } = useSelector((state: RootState) => state.client);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof RepairSchema>>({
    resolver: zodResolver(RepairSchema),
    mode: "onSubmit",
    defaultValues: {
      id: 1,
      desc: "",
      price: 0,
      isPaid: 0,
      isDelivered: 0,
      createdAt: new Date(),
      deliveredAt: undefined,
      paidAt: undefined,
    },
  });

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (clients.length === 0) {
      dispatch(getClientsThunk());
    }
  }, []);

  async function onSubmit(data: z.infer<typeof RepairSchema>) {
    const res = await addData<Omit<Repair, "id">>(Stores.Repairs, {
      clientId: data.clientId,
      desc: data.desc,
      isDelivered: 0,
      isPaid: 0,
      price: data.price / 100,
      createdAt: new Date(),
      deliveredAt: undefined,
      paidAt: undefined,
    });

    if (typeof res === "string") {
      toast.error(res, { position: "top-center" });
    } else {
      toast.info("Conserto cadastrado com sucesso!", {
        position: "top-center",
      });
      form.reset();
      dispatch(getRepairsThunk());
      handleOpen();
    }
  }

  return (
    <Dialog open={open}>
      <form id="form-repair" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button onClick={handleOpen}>
            Novo Conserto <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Conserto</DialogTitle>
            <DialogDescription>
              Cadastre um novo conserto preenchendo as informações abaixo
            </DialogDescription>
          </DialogHeader>
          <NavLink to="/clients" className={"text-blue-500 underline"}>
            Cliente novo? cadastre aqui.
          </NavLink>
          <FieldGroup>
            <Controller
              name="clientId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="w-full flex justify-between"
                    htmlFor="form-repairs-clientId"
                  >
                    Cliente
                    <Button onClick={() => dispatch(getClientsThunk())}>
                      <RefreshCcw />
                    </Button>
                  </FieldLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        id="form-repairs-clientId"
                        placeholder="Selecione o cliente"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {clients?.length > 0 &&
                          clients.map((client) => {
                            return (
                              <SelectItem
                                key={`client_${client.id}`}
                                value={client.id.toString()}
                              >
                                {client.name}
                              </SelectItem>
                            );
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="desc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-repairs-desc">Descrição</FieldLabel>
                  <Textarea
                    {...field}
                    id="form-repairs-desc"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite aqui"
                    autoComplete="off"
                    maxLength={1000}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-repairs-price">Preço</FieldLabel>
                  <Input
                    {...field}
                    id="form-repairs-price"
                    aria-invalid={fieldState.invalid}
                    placeholder="R$ 0,00"
                    autoComplete="off"
                    maxLength={16}
                    inputMode="numeric"
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      Number(field.value?.toString().replace(/\D/g, "")) / 100,
                    )}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value.replace(/\D/g, "")));
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

            <Button type="submit" form="form-repair">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
