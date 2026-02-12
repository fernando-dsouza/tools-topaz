import { memo, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { FiltroNiveis } from "@/app/log-decoder/components/filtro-niveis";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { LogProcessado } from "@/domain/log/log.types";
import { useWindowVirtualizer } from '@tanstack/react-virtual';

interface ParametrosTabelaLog {
    linhas: LogProcessado[]
    semConteudo: boolean
    analisarLog: (filtro: string[]) => Promise<void>;
    contexto: string;
    aoMudarContexto: (filtro: string) => void;
    mensagem: string;
    aoMudarMensagem: (filtro: string) => void;
    filtroLinhaInicio?: number;
    aoMudarFiltroLinhaInicio: (val?: number) => void;
    filtroQuantidade?: number;
    aoMudarFiltroQuantidade: (val?: number) => void;
    aoCarregarMais: (filtro: string[], novaBusca: boolean) => Promise<void>;
    temMais: boolean;
}

function TabelaLogInterna({
    linhas,
    semConteudo,
    analisarLog,
    contexto,
    aoMudarContexto,
    mensagem,
    aoMudarMensagem,
    filtroLinhaInicio,
    aoMudarFiltroLinhaInicio,
    filtroQuantidade,
    aoMudarFiltroQuantidade,
    aoCarregarMais,
    temMais,
}: ParametrosTabelaLog) {
    const [carregando, definirCarregando] = useState<boolean>(false);
    const [selecionados, definirSelecionados] = useState<string[]>([]);

    const refContainerTabela = useRef<HTMLDivElement>(null);
    const [deslocamentoTabela, definirDeslocamentoTabela] = useState(0);

    useEffect(() => {
        const atualizarDeslocamento = () => {
            if (refContainerTabela.current) {
                definirDeslocamentoTabela(refContainerTabela.current.offsetTop);
            }
        };
        atualizarDeslocamento();
        window.addEventListener('resize', atualizarDeslocamento);
        return () => window.removeEventListener('resize', atualizarDeslocamento);
    }, []);

    const virtualizadorLinhas = useWindowVirtualizer({
        count: linhas.length + 1,
        estimateSize: () => 50,
        overscan: 5,
        scrollMargin: deslocamentoTabela,
    });

    const itensVirtuais = virtualizadorLinhas.getVirtualItems();

    useEffect(() => {
        const [ultimoItem] = [...itensVirtuais].reverse();

        if (!ultimoItem) return;

        if (
            ultimoItem.index >= linhas.length - 1 &&
            temMais &&
            !semConteudo &&
            !carregando
        ) {
            definirCarregando(true);
            aoCarregarMais(selecionados, false).finally(() => definirCarregando(false));
        }
    }, [temMais, carregando, aoCarregarMais, linhas.length, itensVirtuais, selecionados, semConteudo]);

    async function processarLog() {
        definirCarregando(true)
        await analisarLog(selecionados)
        definirCarregando(false)
    }

    return <>
        <div className="p-3 bg-gray-800 flex border-b border-gray-700 items-center justify-between rounded-t-lg">
            <div className='flex gap-4 items-center'>
                <FiltroNiveis aoAlterarFiltro={(niveis) => definirSelecionados(niveis)} />
                <div className="flex gap-2 items-center">
                    <Input
                        type="number"
                        className="bg-gray-900 text-xs p-2 text-gray-300 rounded-md border border-gray-600 w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="De"
                        value={filtroLinhaInicio ?? ''}
                        onChange={(e) => aoMudarFiltroLinhaInicio(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span className="text-gray-500 text-xs">+</span>
                    <Input
                        type="number"
                        className="bg-gray-900 text-xs p-2 text-gray-300 rounded-md border border-gray-600 w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Qtd"
                        value={filtroQuantidade ?? ''}
                        onChange={(e) => aoMudarFiltroQuantidade(e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>
                <Input
                    className="bg-gray-900 text-xs p-2 text-gray-300 rounded-md border border-gray-600 w-60"
                    placeholder="Filtrar contexto (ex: 100003)..."
                    value={contexto}
                    onChange={(e) => aoMudarContexto(e.target.value)}
                />
                <Input
                    className="bg-gray-900 text-xs text-gray-300 p-2 rounded-md border border-gray-600 w-60"
                    placeholder="Filtrar mensagem..."
                    value={mensagem}
                    onChange={(e) => aoMudarMensagem(e.target.value)}
                />
                <Button
                    className='bg-blue-500 cursor-pointer'
                    disabled={carregando || semConteudo}
                    onClick={() => processarLog()}>
                    {carregando ?
                        <Spinner />
                        : <Search />
                    } Buscar log
                </Button>
            </div>
            {linhas.length > 0 && (
                <p className="text-gray-500 text-[11px] ml-4 whitespace-nowrap">
                    {linhas.length} registro{linhas.length !== 1 ? 's' : ''} carregado{linhas.length !== 1 ? 's' : ''}
                </p>
            )}
        </div>

        <div ref={refContainerTabela} className="w-full relative bg-gray-800 rounded-b-lg overflow-hidden">
            <div
                style={{
                    height: `${virtualizadorLinhas.getTotalSize() + 15}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                <div
                    className="w-full relative"
                    style={{
                        transform: `translateY(${itensVirtuais[0] ? itensVirtuais[0].start - virtualizadorLinhas.options.scrollMargin : 0}px)`
                    }}
                >
                    <table className='w-full caption-bottom text-[11px] text-white font-mono bg-gray-800 table-fixed'>
                        <TableHeader className="bg-gray-900 w-full grid grid-cols-[50px_80px_95px_90px_280px_1fr]">
                            <TableRow className='bg-gray-900 hover:bg-gray-800/10 border-gray-700 flex w-full h-10 items-center'>
                                <TableHead className="w-[50px] text-gray-400 text-center shrink-0 h-full flex items-center justify-center pt-2">#</TableHead>
                                <TableHead className="w-[80px] text-gray-400 text-center shrink-0 h-full flex items-center justify-center pt-2">DATA</TableHead>
                                <TableHead className="w-[95px] text-gray-400 text-center shrink-0 h-full flex items-center justify-center pt-2">HORA</TableHead>
                                <TableHead className="w-[90px] text-gray-400 text-center shrink-0 h-full flex items-center justify-center pt-2">NÍVEL</TableHead>
                                <TableHead className="w-[280px] text-gray-400 shrink-0 h-full flex items-center pt-2 pl-2">CONTEXTO</TableHead>
                                <TableHead className="text-gray-400 flex-1 h-full flex items-center pt-2 pl-2">MENSAGEM</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="grid w-full">
                            {itensVirtuais.map((linhaVirtual) => {
                                const eLinhaCarregamento = linhaVirtual.index > linhas.length - 1;
                                const log = linhas[linhaVirtual.index];

                                if (eLinhaCarregamento) {
                                    return (
                                        <TableRow
                                            key={linhaVirtual.key}
                                            data-index={linhaVirtual.index}
                                            ref={virtualizadorLinhas.measureElement}
                                            className="flex w-full justify-center p-4 border-t border-gray-700 hover:bg-transparent"
                                        >
                                            <TableCell colSpan={5} className="flex justify-center text-gray-500 gap-2 text-[11px] h-12 items-center">
                                                {temMais && !semConteudo ? (
                                                    <><Spinner className="h-3 w-3" /> Carregando...</>
                                                ) : linhas.length === 0 ? (
                                                    semConteudo ? 'Nenhum arquivo de log carregado.' : 'Nenhum registro encontrado.'
                                                ) : (
                                                    'Todos os registros foram carregados'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                return (
                                    <TableRow
                                        key={linhaVirtual.key}
                                        data-index={linhaVirtual.index}
                                        ref={virtualizadorLinhas.measureElement}
                                        className='hover:bg-gray-600/10 border-gray-700 flex w-full'
                                    >
                                        <TableCell className='text-gray-500 align-top w-[50px] shrink-0 text-center'>{log.linha}</TableCell>
                                        <TableCell className='text-gray-400 align-top w-[80px] shrink-0'>{log.data}</TableCell>
                                        <TableCell className='text-blue-500 align-top w-[95px] shrink-0'>{log.hora}</TableCell>
                                        <TableCell className='uppercase text-[10px] align-top w-[90px] shrink-0'><span
                                            className={`px-1 rounded ${log.nivel === 'Erro' ? 'bg-red-900 text-white' : 'bg-gray-700'}`}>
                                            {log.nivel}
                                        </span></TableCell>
                                        <TableCell className='max-w-[300px] text-orange-200/70 py-2 align-top cursor-help w-[280px] shrink-0'>
                                            <p className='truncate' title={log.contexto}>{log.contexto}</p>
                                        </TableCell>
                                        <TableCell
                                            className='text-gray-200 whitespace-pre-wrap break-words leading-relaxed flex-1'>
                                            <p className={`${log.nivel === 'Erro' ? 'text-red-400 bg-red-950/20' : 'text-gray-300'}`}>
                                                {log.mensagem}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </table>
                </div>
            </div>
        </div>
    </>
}

export const TabelaLog = memo(TabelaLogInterna);
