import {Log} from "@/types/log";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {FiltroNivelMulti} from "@/app/log-decoder/components/filtro-nivel-multi";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";

interface LogTabelaParam {
    rows: Log[]
    semConteudo: boolean
    analisarLog: (filtro: string[]) => Promise<void>;
}


export function LogTabela({rows, semConteudo, analisarLog}: LogTabelaParam) {
    const [loading, setLoading] = useState<boolean>(false);

    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [filtroContexto, setFiltroContexto] = useState('');
    const [filtroMensagem, setFiltroMensagem] = useState('');

    // const dadosFiltrados = rows.filter(log => {
    //     const bateNivel = selecionados.length === 0 || selecionados.includes(log.nivel);
    //     const bateContexto = log.contexto.toLowerCase().includes(filtroContexto.toLowerCase());
    //     const bateMensagem = log.mensagem.toLowerCase().includes(filtroMensagem.toLowerCase())
    //     return bateNivel && bateContexto && bateMensagem;
    // });

    async function processarLog() {
        setLoading(true)
        await analisarLog(selecionados)
        setLoading(false)
    }

    return <>
        <div className="p-3 bg-gray-800 flex border-b border-gray-700 items-center justify-between">
            <div className='flex gap-4'>
                <FiltroNivelMulti onFiltroChange={(niveis) => setSelecionados(niveis)}/>
                <Input
                    className="bg-gray-900 text-xs p-2 text-gray-300 rounded-md border border-gray-600 w-80"
                    placeholder="Filtrar contexto (ex: 100003)..."
                    onChange={(e) => setFiltroContexto(e.target.value)}
                />
                <Input
                    className="bg-gray-900 text-xs text-gray-300 p-2 rounded-md border border-gray-600 w-80"
                    placeholder="Filtrar mensagem..."
                    onChange={(e) => setFiltroMensagem(e.target.value)}
                />
            </div>
            <Button
                className='bg-blue-500 cursor-pointer'
                disabled={loading || semConteudo}
                onClick={() => processarLog()}>
                {loading ?
                    <Spinner/>
                    : <Search/>
                } Analisar log
            </Button>
        </div>


        <Table className='text-white text-[11px] font-mono bg-gray-800 table-fixed w-full'>
            <TableHeader>
                <TableRow className='bg-gray-900 hover:bg-gray-800/10 border-gray-700'>
                    <TableHead className="w-[80px] text-gray-400 text-center">DATA</TableHead>
                    <TableHead className="w-[95px] text-gray-400 text-center">HORA</TableHead>
                    <TableHead className="w-[65px] text-gray-400 text-center">NÍVEL</TableHead>
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
                        <TableCell className='text-gray-400'>{log.data}</TableCell>
                        <TableCell className='text-blue-500'>{log.hora}</TableCell>
                        <TableCell className='uppercase text-[10px]'><span
                            className={`px-1 rounded ${log.nivel === 'Erro' ? 'bg-red-900 text-white' : 'bg-gray-700'}`}>
                                {log.nivel}
                            </span></TableCell>
                        <TableCell className='max-w-[300px] text-orange-200/70 py-2'>
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
            <TableCaption className='mb-1'>Fim dos registros de log</TableCaption>
        </Table>
    </>
}