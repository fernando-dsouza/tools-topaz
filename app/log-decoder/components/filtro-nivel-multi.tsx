import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Filter} from "lucide-react";

interface FiltroNivelMultiProps {
    onFiltroChange: (niveis: string[]) => void;
}

const niveisDisponiveis = ["Erro", "Notificación", "Depurar", "Fase"];

export function FiltroNivelMulti({onFiltroChange}: FiltroNivelMultiProps) {
    const [selecionados, setSelecionados] = useState<string[]>([]);

    const toggleNivel = (nivel: string) => {
        const novosSelecionados = selecionados.includes(nivel)
            ? selecionados.filter((n) => n !== nivel)
            : [...selecionados, nivel];

        console.log(novosSelecionados);
        setSelecionados(novosSelecionados);
        onFiltroChange(novosSelecionados);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline"
                        className="text-[12px] border-gray-700 bg-gray-800 text-gray-300 cursor-pointer">
                    <Filter className="h-3 w-3"/>
                    Níveis ({selecionados.length})
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-gray-900 border-gray-700">
                <div className="space-y-2">
                    {niveisDisponiveis.map((nivel) => (
                        <div key={nivel} className="flex items-center space-x-2 p-1 hover:bg-gray-800 rounded">
                            <Checkbox
                                id={nivel}
                                checked={selecionados.includes(nivel)}
                                onCheckedChange={() => toggleNivel(nivel)}
                                className="border-gray-500 cursor-pointer"
                            />
                            <label
                                htmlFor={nivel}
                                className="text-xs font-medium leading-none text-gray-200 cursor-pointer flex-1"
                            >
                                {nivel}
                            </label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}