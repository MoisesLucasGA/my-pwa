import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "react-day-picker/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DayPicker } from "react-day-picker";

interface DatePickerProps {
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defaultDate?: Date | undefined;
}

export const DatePicker: React.FC<
  DatePickerProps & React.ComponentProps<typeof DayPicker>
> = ({ setDate, defaultDate = undefined, ...props }: DatePickerProps) => {
  const [date, setLocalDate] = React.useState<Date | undefined>(defaultDate);
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDate = (value: Date | undefined) => {
    setDate(value);
    setLocalDate(value);
  };

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleOpen}
          variant="outline"
          data-empty={!date}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "dd/MM/yyyy") : <span>Escolha uma data</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDate}
          defaultMonth={date}
          lang="pt-BR"
          locale={ptBR}
          footer={
            <div className="flex justify-between">
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  handleDate(undefined);
                  handleOpen();
                }}
              >
                Limpar
              </Button>
              <Button size={"sm"} onClick={handleOpen}>
                Confirmar
              </Button>
            </div>
          }
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};
