import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Clipboard, Binary, Maximize, Search, Trash2, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useCallback, useState } from "react";
import { processarCola } from "@/domain/cola/cola-decode.service";
import { LinhaCola } from "@/domain/cola/cola.types";
import { TabelaCola } from "@/app/cola-decoder/tabela-cola";
import { useArmazenamentoLocal } from "@/hooks/use-armazenamento-local";
import { Spinner } from "@/components/ui/spinner";

export default function DecodificadorCola() {
    const [texto, definirTexto] = useArmazenamentoLocal('stringCola', '');
    const [dadosCola, definirDadosCola] = useState<LinhaCola[]>();
    const [carregando, definirCarregando] = useState(false);

    const buscarTextoAreaTransferencia = useCallback(async () => {
        const textoArea = await navigator.clipboard.readText();
        definirTexto(textoArea);
    }, [definirTexto]);

    const analisarCola = useCallback(async (cola: string, larguraCola: number) => {
        definirCarregando(true);
        try {
            await new Promise(resolver => setTimeout(resolver, 10));
            const dadosProcessados = processarCola(cola, larguraCola);
            definirDadosCola(dadosProcessados);
        } finally {
            definirCarregando(false);
        }
    }, []);

    const tamanhoTexto = texto.length
    const percentual = (tamanhoTexto * 100) / 5000

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Binary className='h-3 w-3 text-gray-300' />
                        <p className='text-gray-300 text-[12px]'>STRING COLA</p>
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
                    </div>
                </CardTitle>
                <CardContent className='p-0'>
                    <Textarea
                        className='rounded-none bg-black text-gray-100 h-[144px] border-none'
                        value={texto}
                        placeholder='Cole o texto do campo "COLA" aqui...'
                        onChange={(e) => definirTexto(e.target.value)} />
                </CardContent>
            </Card>

            <div className='w-[300px] space-y-5'>
                <Card className='p-0 gap-0 h-32 overflow-hidden border-none'>
                    <CardTitle className='flex items-center h-26 space-x-2 p-3 mb-0 justify-between'>
                        <div className="flex space-x-2">
                            <Maximize className='h-3 w-3 text-gray-300' />
                            <p className='text-gray-300 text-[12px]'>LARGURA STRING</p>
                        </div>
                    </CardTitle>
                    <CardContent className='px-4 pb-4 bg-gray-800'>
                        <div className='flex items-end space-x-2'>
                            <p className='text-[35px] text-gray-300'>{tamanhoTexto}</p>
                            <p className='text-[14px] text-gray-400 mb-2.5'>Chars</p>
                        </div>
                        <Progress value={percentual} className="bg-primary" />
                    </CardContent>
                </Card>

                <Button className='bg-blue-500 h-12 w-full cursor-pointer'
                    disabled={carregando || !texto}
                    onClick={() => analisarCola(texto, tamanhoTexto)}>
                    {carregando ? <Spinner /> : <Search />}
                    Analisar COLA
                </Button>
            </div>
        </div>

        <div className='p-5 -mt-2'>
            <Card className='p-0 gap-0 h-fit overflow-hidden border-none'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Sheet className='h-3 w-3 text-gray-300' />
                        <p className='text-gray-300 text-[12px]'>DECODIFICAR</p>
                    </div>
                </CardTitle>
                {dadosCola && dadosCola.length === 0
                    ? <p className="text-gray-500 text-sm text-center py-6">Nenhum resultado encontrado.</p>
                    : <TabelaCola linhas={dadosCola ?? []} />
                }
            </Card>
        </div>
    </>
}
