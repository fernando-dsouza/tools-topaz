import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {FiltroNivelMulti} from "@/app/log-decoder/components/filtro-nivel-multi";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {ParsedLog} from "@/domain/log/log.types";

interface LogTabelaParam {
    rows: ParsedLog[]
    semConteudo: boolean
    analisarLog: (filtro: string[]) => Promise<void>;
    contexto: string;
    aoMudarContexto: (filtro: string) => void;
    mensagem: string;
    aoMudarMensagem: (filtro: string) => void;
    onLoadMore: (filtro: string[], isNewSearch: boolean) => Promise<void>;
    hasMore: boolean;
}


export function LogTabela({
                              rows,
                              semConteudo,
                              analisarLog,
                              contexto,
                              aoMudarContexto,
                              mensagem,
                              aoMudarMensagem,
                              onLoadMore,
                              hasMore,
                          }: LogTabelaParam) {
    const [loading, setLoading] = useState<boolean>(false);
    const [selecionados, setSelecionados] = useState<string[]>([]);

    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setLoading(true)
                    await onLoadMore(selecionados, false);
                    setLoading(false)
                }
            },
            {threshold: 1.0}
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [observerTarget, hasMore, loading, onLoadMore]);

    async function processarLog() {
        setLoading(true)
        await analisarLog(selecionados)
        setLoading(false)
    }

    return <>
        <div className="p-3 bg-gray-800 flex border-b border-gray-700 items-center">
            <div className='flex gap-4'>
                <FiltroNivelMulti onFiltroChange={(niveis) => setSelecionados(niveis)}/>
                <Input
                    className="bg-gray-900 text-xs p-2 text-gray-300 rounded-md border border-gray-600 w-80"
                    placeholder="Filtrar contexto (ex: 100003)..."
                    value={contexto}
                    onChange={(e) => aoMudarContexto(e.target.value)}
                />
                <Input
                    className="bg-gray-900 text-xs text-gray-300 p-2 rounded-md border border-gray-600 w-80"
                    placeholder="Filtrar mensagem..."
                    value={mensagem}
                    onChange={(e) => aoMudarMensagem(e.target.value)}
                />
                <Button
                    className='bg-blue-500 cursor-pointer'
                    disabled={loading || semConteudo}
                    onClick={() => processarLog()}>
                    {loading ?
                        <Spinner/>
                        : <Search/>
                    } Buscar log
                </Button>
            </div>
        </div>


        <Table className='text-white text-[11px] font-mono bg-gray-800 table-fixed w-full'>
            <TableHeader>
                <TableRow className='bg-gray-900 hover:bg-gray-800/10 border-gray-700'>
                    <TableHead className="w-[80px] text-gray-400 text-center">DATA</TableHead>
                    <TableHead className="w-[95px] text-gray-400 text-center">HORA</TableHead>
                    <TableHead className="w-[90px] text-gray-400 text-center">NÍVEL</TableHead>
                    <TableHead className="w-[280px] text-gray-400">CONTEXTO</TableHead>
                    <TableHead className="text-gray-400">MENSAGEM</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((log, index) => (
                    <TableRow
                        key={index}
                        className='hover:bg-gray-600/10 border-gray-700'
                    >
                        <TableCell className='text-gray-400 align-top'>{log.data}</TableCell>
                        <TableCell className='text-blue-500 align-top'>{log.hora}</TableCell>
                        <TableCell className='uppercase text-[10px] align-top'><span
                            className={`px-1 rounded ${log.nivel === 'Erro' ? 'bg-red-900 text-white' : 'bg-gray-700'}`}>
                                {log.nivel}
                            </span></TableCell>
                        <TableCell className='max-w-[300px] text-orange-200/70 py-2 align-top cursor-help'>
                            <p className='truncate' title={log.contexto}>{log.contexto}</p>
                        </TableCell>
                        <TableCell
                            className='text-gray-200 whitespace-pre-wrap break-words leading-relaxed'>
                            <p className={`${log.nivel === 'Erro' ? 'text-red-400 bg-red-950/20' : 'text-gray-300'}\`}`}>
                                {log.mensagem}
                            </p>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        <div ref={observerTarget} className="h-10 flex items-center justify-center text-[14px]">
            {loading && <div className='flex text-gray-400 items-center text-center space-x-1'>
                <Spinner className='h-5 w-5 text-gray-400'/><p>Carregando...</p>
            </div>}
            {!hasMore && rows.length > 0 && <p className="text-gray-400">Fim dos registros</p>}
        </div>
    </>
}