import { Button } from "@/components/ui/button.tsx";
import { ArrowDown, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router";

interface BeforeInstallPromptEvent extends Event {
  prompt?: () => Promise<any>;
}

export const Home = () => {
  window.addEventListener("beforeinstallprompt", (event: Event) => {
    event.preventDefault();
    const installButton = document.querySelector("#install");
    const installPrompt: BeforeInstallPromptEvent = event;
    installButton?.removeAttribute("hidden");

    installButton?.addEventListener("click", async () => {
      if (!installPrompt.prompt) {
        return;
      }
      const result = await installPrompt.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      installButton.setAttribute("hidden", "");
    });
  });

  return (
    <div className="h-dvh flex flex-col justify-between items-center pb-2 bg-[#f7f2e5] bg-size-[10px_10px] opacity-80 bg-radial from-primary from-[1px] to-accent to-[1px]">
      <div className="">
        <h1 className="text-8xl font-extrabold text-black text-center">
          Bem-Vinda
        </h1>
      </div>
      <div className="max-w-1/2 p-2 bg-accent rounded-xl shadow-[3px_4px_4px] shadow-gray-500">
        <h3 className="font-bold text-xl text-black text-center">
          Aqui você vai poder gerenciar seus clientes e consertos.
        </h3>
      </div>
      <div className="flex flex-row gap-2 items-center justify-around">
        <NavLink
          to="/clients"
          className="bg-primary rounded-2xl pb-2 pt-2 pl-4 pr-4 text-accent font-medium flex flex-row items-center justify-center"
        >
          <span className="flex flex-row items-center justify-around gap-1">
            <ArrowUpLeft />
            Clientes
          </span>
        </NavLink>
        <NavLink
          to="/repairs"
          className="bg-primary rounded-2xl pb-2 pt-2 pl-4 pr-4 text-accent font-medium flex flex-row items-center justify-center"
        >
          <span className="flex flex-row items-center justify-around gap-1">
            Consertos
            <ArrowUpRight />
          </span>
        </NavLink>
      </div>

      <Button
        id="install"
        variant={"secondary"}
        hidden
        className="absolute top-4 right-4 z-10 shadow-[3px_4px_4px] shadow-gray-500"
      >
        Instalar
        <ArrowDown></ArrowDown>
      </Button>
    </div>
  );
};
