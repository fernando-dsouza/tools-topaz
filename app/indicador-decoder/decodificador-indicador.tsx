import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Clipboard, MousePointer2, Search, Trash2, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { analisarIndicador as servicoAnalisarIndicador } from "@/domain/indicador/indicador-decode.service";
import { Indicador } from "@/domain/indicador/indicador.types";
import { TabelaIndicador } from "@/app/indicador-decoder/tabela-indicador";
import { useArmazenamentoLocal } from "@/hooks/use-armazenamento-local";

const COLUNAS_PADRAO = 25;

export default function DecodificadorIndicador() {
    const [colunas, definirColunas] = useState<number>(COLUNAS_PADRAO);
    const [dadosIndicador, definirDadosIndicador] = useState<Indicador[][]>();
    const [texto, definirTexto] = useArmazenamentoLocal('stringIndicador', '');

    const buscarTextoAreaTransferencia = useCallback(async () => {
        const textoArea = await navigator.clipboard.readText();
        definirTexto(textoArea);
    }, [definirTexto]);

    const analisarIndicador = useCallback(async (indicador: string) => {
        const dados = servicoAnalisarIndicador(indicador, colunas);
        definirDadosIndicador(dados);
    }, [colunas]);

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <MousePointer2 className='h-3 w-3 text-gray-300' />
                        <p className='text-gray-300 text-[12px]'>STRING MOV-INDICATORS</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                            onClick={() => definirTexto('')}>
                            <Trash2 />
                            Limpar
                        </Button>
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                            onClick={() => buscarTextoAreaTransferencia()}>
                            <Clipboard className='h-2 w-2' />
                            Colar
                        </Button>
                        <Button className='bg-blue-500 h-7 cursor-pointer'
                            onClick={() => analisarIndicador(texto)}>
                            <Search />
                            Analisar indicador
                        </Button>
                    </div>
                </CardTitle>
                <CardContent className='p-0'>
                    <Input
                        className='border-none bg-black text-white rounded-none h-10'
                        type='text'
                        value={texto}
                        placeholder='Cole o indicador aqui...'
                        onChange={(e) => definirTexto(e.target.value)} />
                </CardContent>
            </Card>
        </div>

        <div className='flex p-5 -mt-2 items-center justify-center'>
            <Card className='p-0 gap-0 h-fit w-fit overflow-hidden border-none'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between space-x-20'>
                    <div className="flex space-x-2">
                        <Sheet className='h-3 w-3 text-gray-300' />
                        <p className='text-gray-300 text-[12px]'>DECODIFICAR</p>
                    </div>
                    <div className='flex items-center space-x-2 text-[12px] text-gray-300'>
                        <p>COLUNAS</p>
                        <Input type="number"
                            value={colunas}
                            onChange={(e) => definirColunas(Number(e.target.value))}
                            className="w-14 h-8 bg-gray-800 border-gray-600 text-white text-center
                                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                                          [&::-webkit-inner-spin-button]:appearance-none focus:ring-blue-500
                                          focus:border-blue-500 text-white"
                            placeholder="0" />
                    </div>
                </CardTitle>
                <TabelaIndicador indicadores={dadosIndicador ?? []} colunas={colunas} />
            </Card>
        </div>
    </>
}
