'use client'

import { Binary, MousePointer2, Terminal } from "lucide-react"
import DecodificadorCola from "@/app/cola-decoder/decodificador-cola";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import DecodificadorIndicador from "@/app/indicador-decoder/decodificador-indicador";
import DecodificadorLog from "@/app/log-decoder/decodificador-log";
import { useArmazenamentoLocal } from "@/hooks/use-armazenamento-local";

const CONFIG_ABAS: Record<string, { rotulo: string; icone: typeof Binary }> = {
    'cola-decoder': { rotulo: 'Cola Decoder', icone: Binary },
    'indicador-decoder': { rotulo: 'Indicador Decoder', icone: MousePointer2 },
    'log-decoder': { rotulo: 'Log Decoder', icone: Terminal },
};

export default function ClienteTopazTools() {
    const [montado, definirMontado] = useState(false);
    const [aba, definirAba] = useArmazenamentoLocal('ultimoTab', 'cola-decoder');

    useEffect(() => {
        definirMontado(true);
    }, []);

    const abaAtual = CONFIG_ABAS[aba] ?? CONFIG_ABAS['cola-decoder'];
    const IconeAtual = abaAtual.icone;

    return <>
        <div className="flex h-16 bg-primary py-3 px-5 items-center justify-between">
            <div className='flex space-x-2 items-center'>
                <div className='flex items-center justify-center h-10 w-10 rounded-md bg-blue-400/20'>
                    <IconeAtual className='text-blue-500' />
                </div>
                <div>
                    <p className='text-gray-300 font-semibold'>TOPAZ Tools</p>
                    <p className='-mt-1 text-gray-400 text-[10px] font-semibold'>
                        {abaAtual.rotulo}
                    </p>
                </div>
            </div>

            {!montado
                ? ''
                : <div className="flex space-x-2">
                    <Tabs value={aba} onValueChange={(valor) => definirAba(valor)}>
                        <TabsList className='space-x-2 px-1 pb-1 bg-gray-300'>
                            <TabsTrigger
                                value="cola-decoder"
                                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer"
                                asChild>
                                <div>
                                    <Binary className="w-4 h-4 text-blue-500" />
                                    COLA decoder
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="indicador-decoder"
                                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer"
                                asChild>
                                <div>
                                    <MousePointer2 className="w-4 h-4 text-blue-500" />
                                    Indicador decoder
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="log-decoder"
                                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer"
                                asChild>
                                <div>
                                    <Terminal className="w-4 h-4 text-blue-500" />
                                    Log decoder
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>}
        </div>

        {!montado
            ? ''
            : <>
                {aba === 'cola-decoder' && <DecodificadorCola />}
                {aba === 'indicador-decoder' && <DecodificadorIndicador />}
                {aba === 'log-decoder' && <DecodificadorLog />}
            </>
        }
    </>
}
