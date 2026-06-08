import { DatePicker } from "@/components/custom/DatePicker";
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
import { Textarea } from "@/components/ui/textarea";
import {
  RepairSchema,
  Stores,
  updateData,
  type Repair,
  type RepairResponse,
} from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface RepairEditProps {
  data: RepairResponse;
}

export const RepairEdit: React.FC<RepairEditProps> = ({
  data,
}: RepairEditProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof RepairSchema>>({
    resolver: zodResolver(RepairSchema),
    mode: "onSubmit",
    defaultValues: {
      ...data,
      price: data.price * 100,
    },
  });

  const handleOpen = () => {
    setOpen(!open);
  };

  async function onSubmit(data: z.infer<typeof RepairSchema>) {
    const res = await updateData<Repair>(Stores.Repairs, {
      ...data,
      isDelivered: data.deliveredAt ? 1 : 0,
      isPaid: data.paidAt ? 1 : 0,
      price: data.price / 100,
    });
    if (typeof res === "string") {
      toast.error(res, { position: "top-center" });
    } else {
      toast.info("Conserto atualizado com sucesso!", {
        position: "top-center",
      });
      form.reset();
    }
    handleOpen();
  }

  return (
    <Dialog open={open}>
      <form
        id={`form-repair-edit-${data.id}`}
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
              name="desc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-repair-edit-desc">
                    Descrição
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-repair-edit-desc"
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
                  <FieldLabel htmlFor="form-repair-edit-price">
                    Preço
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-repair-edit-price"
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

            <Controller
              name="paidAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-repair-edit-paidAt">
                    Data do Pagamento
                  </FieldLabel>
                  <DatePicker
                    id="form-repair-edit-paidAt"
                    defaultDate={data.paidAt}
                    setDate={(value) => {
                      field.onChange(value);
                    }}
                  ></DatePicker>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="deliveredAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-repair-edit-deliveredAt">
                    Data da Entrega
                  </FieldLabel>
                  <DatePicker
                    id="form-repair-edit-deliveredAt"
                    defaultDate={data.deliveredAt}
                    setDate={(value) => {
                      field.onChange(value);
                    }}
                  ></DatePicker>
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

            <Button type="submit" form={`form-repair-edit-${data.id}`}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
