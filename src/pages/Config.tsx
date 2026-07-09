import { Button } from "@/components/ui/button";
import { ExportData, ImportData } from "@/db";
import { Upload, XCircle } from "lucide-react";
import { useRef, useState } from "react";

export const Config = () => {
  const [file, setFile] = useState<File | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const files = e.target.files;

    if (files && files.length === 1) {
      for (const file of files) {
        setFile(file);
      }
    }
  };

  const handleClearFile = () => {
    if (ref.current) {
      ref.current.value = "";
    }
    setFile(null);
  };

  const handleImport = () => {
    if (file) {
      ImportData(file);
    }
  };

  return (
    <div className="flex w-full h-full flex-col pt-2 pb-2 pl-4 pr-4 overflow-auto">
      <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-10">
        Configurações
      </h1>

      <div className="flex flex-col gap-2">
        <Button onClick={ExportData}>Exportar Dados</Button>

        <Button variant={"outline"} disabled={!file} onClick={handleImport}>
          Importar Dados
        </Button>
        <div className="min-h-20 border border-dashed p-4 flex items-center justify-center bg-gray-50 border-gray-200 rounded-lg">
          <label htmlFor="import">
            {file ? (
              <div className="flex justify-center items-center">
                <p className="text-center">{file.name}</p>
                <Button
                  variant={"ghost"}
                  size={"icon-lg"}
                  onClick={handleClearFile}
                >
                  <XCircle></XCircle>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-center items-center">
                Selecionar o arquivo com os dados para ser importado.
                <Upload className="text-gray-600" />
              </div>
            )}
          </label>

          <input
            ref={ref}
            className="hidden"
            type="file"
            name="import"
            id="import"
            accept=".json"
            multiple={false}
            onChange={handleFileInput}
          />
        </div>
        <Button
          variant={"secondary"}
          onClick={() => {
            navigation.back();
          }}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
};
