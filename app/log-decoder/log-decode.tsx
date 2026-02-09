import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Terminal, Maximize, Sheet, Trash2, FileUp, Info} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ChangeEvent, useState} from "react";
import {LogTabela} from "@/app/log-decoder/log-tabela";
import {Spinner} from "@/components/ui/spinner";
import {createLogBrowserParser} from "@/domain/log/log-stream-parser.service";
import {ParsedLog} from "@/domain/log/log.types";
import {buscaLogsPaginadosAction, excluirLogsAction, salvarIndexAction} from "@/domain/log/log.action";
import {Progress} from "@/components/ui/progress";
import notificacao from "@/components/notificacao";

const formatarTamanhoArquivo = (bytes: number): { valor: string, unidade: string } => {
    if (bytes === 0) return {valor: "0", unidade: "Bytes"};

    const k = 1024;
    const tamanhos = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
        valor: parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString(),
        unidade: tamanhos[i]
    };
};

export default function LogDecode() {

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [logsProcessados, setLogsProcessados] = useState<ParsedLog[]>();

    const [filtroContexto, setFiltroContexto] = useState<string>('')
    const [filtroMensagem, setFiltroMensagem] = useState<string>('')

    const [progresso, setProgresso] = useState(0);

    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const LIMIT = 500;

    const [tamanhoArquivo, setTamanhoArquivo] = useState<{ valor: string; unidade: string }>(() => {
        if (typeof window === "undefined") {
            return {valor: '0', unidade: 'Bytes'};
        }

        const salvo = localStorage.getItem("tamanhoArquivo");
        return salvo ? JSON.parse(salvo) : {valor: '0', unidade: 'Bytes'};
    });

    const [textoLog, setTextoLog] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const salvo = localStorage.getItem('stringTextoLog');
            try {
                return salvo ? JSON.parse(salvo) : '';
            } catch (err) {
                console.error(err)
                return '';
            }
        }
        return '';
    });

    const [logId, setLogId] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const salvo = localStorage.getItem('stringLogIdArquivo');
            try {
                return salvo ? JSON.parse(salvo) : '';
            } catch (err) {
                console.error(err)
                return null;
            }
        }
        return null;
    });

    async function processarConteudoLog(filtro: string[], isNewSearch: boolean = true) {
        if (!logId) return;

        const currentOffset = isNewSearch ? 0 : offset;

        try {
            const res = await buscaLogsPaginadosAction(
                currentOffset, LIMIT, logId, filtro, filtroContexto, filtroMensagem
            )

            const novosLogs = res;

            if (isNewSearch) {
                setLogsProcessados(novosLogs);
                setOffset(novosLogs.length);
            } else {
                setLogsProcessados(prev => [...(prev || []), ...novosLogs]);
                setOffset(prev => prev + novosLogs.length);
            }

            setHasMore(novosLogs.length === LIMIT);
        } catch (err) {
            notificacao('erro', `Erro ao consultar log: ${err}`);
        }
    }

    const uploadArquivoLog = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (logId) await limpar()

        const tamanhoArquivo = formatarTamanhoArquivo(file.size)
        setTamanhoArquivo(tamanhoArquivo);
        localStorage.setItem("tamanhoArquivo", JSON.stringify(tamanhoArquivo));

        setLoading(true);
        setProgresso(0);

        const fileId = `${Date.now()}`;
        setLogId(Number(fileId));
        localStorage.setItem('stringLogIdArquivo', JSON.stringify(Number(fileId)))

        const reader = file.stream().getReader();
        const decoder = new TextDecoder("latin1");

        const parser = createLogBrowserParser(fileId);

        let batch: ParsedLog[] = [];
        const BATCH_SIZE = 2000;
        let bytesProcessed = 0;
        let flushing = false;

        async function flushBatch() {
            if (batch.length === 0) return;
            const toSend = batch;
            batch = [];
            flushing = true;
            await salvarIndexAction(toSend);
            flushing = false;
        }

        let previewBuffer = '';
        const PREVIEW_LIMIT = 200;
        let previewDone = false;

        try {
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                bytesProcessed += value.length;
                const chunk = decoder.decode(value, {stream: true});

                if (!previewDone) {
                    previewBuffer += chunk;

                    if (previewBuffer.length >= PREVIEW_LIMIT) {
                        const previewTexto = previewBuffer.slice(0, PREVIEW_LIMIT)
                        setTextoLog(previewTexto);
                        localStorage.setItem('stringTextoLog', JSON.stringify(previewTexto))
                        previewDone = true;
                    }
                }

                parser.push(chunk, (log) => {
                    batch.push(log);
                });

                if (batch.length >= BATCH_SIZE) {
                    await flushBatch(); // 🔥 pausa AQUI, não no reader
                }

                setProgresso(Math.round((bytesProcessed / file.size) * 100));
            }

            if (batch.length > 0) {
                await flushBatch();
            }

            if (!previewDone && previewBuffer.length > 0) {
                const previewTexto = previewBuffer.slice(0, PREVIEW_LIMIT)
                setTextoLog(previewTexto);
                localStorage.setItem('stringTextoLog', JSON.stringify(previewTexto))
            }

            notificacao('sucesso', "Log processado!");
        } catch (err) {
            notificacao('erro', `Erro no processamento: ${err}`);
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    async function limpar() {
        try {
            setLoadingDelete(true)
            if (logId) {
                await excluirLogsAction(logId)
            }
            setTextoLog('');
            setLogsProcessados([]);
            localStorage.removeItem("tamanhoArquivo");
            setTamanhoArquivo({valor: '0', unidade: 'Bytes'});
            setOffset(0);
            setHasMore(true);

            notificacao('sucesso', "Os dados de log foram excluídos!");
        } catch (err) {
            notificacao('erro', `Erro ao limpar logs no servidor ${err}`);
        } finally {
            setLoadingDelete(false)
        }
    }

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".log,.txt"
                onChange={uploadArquivoLog}
            />

            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Terminal className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>PREVIEW LOG</p>
                    </div>
                    <div className="flex space-x-2">
                        {loading && <div className='flex items-center space-x-1 text-gray-300 mr-2 text-[11px]'>
                            <p>{progresso}%</p>
                            <Progress value={progresso} className='w-15 mt-0.5'/>
                        </div>}
                        {loadingDelete && <div className='flex items-center space-x-1 text-gray-300 mr-2 text-[11px]'>
                            <Spinner/>
                            <p>Excluindo logs...</p>
                        </div>}
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                                onClick={() => limpar()}
                                disabled={loading}>
                            <Trash2/>
                            Limpar
                        </Button>
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                                onClick={() => document.getElementById('fileInput')?.click()}
                                disabled={loading}>
                            <div className='flex items-center space-x-1'>
                                {loading ? <Spinner/> : <FileUp className='h-2 w-2'/>}
                                <p>Upload log</p>
                            </div>
                        </Button>
                        <div className="flex space-x-2 items-center bg-blue-600/50 rounded-md px-2">
                            <Info className='h-4 w-4 text-white'/>
                            <p className='text-gray-300 text-[12px]'>Max.: 1Gb</p>
                        </div>
                    </div>
                </CardTitle>
                <CardContent className='p-0 overflow-hidden bg-black h-[76px] relative'>
                    <div className='p-3 font-mono text-[12px] text-gray-400 h-full whitespace-pre-wrap overflow-hidden'>
                        {textoLog || 'Uma prévia do conteúdo do log aparecerá aqui...'}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black to-transparent
                                    pointer-events-none"
                    />
                </CardContent>
            </Card>

            <div className='w-[300px] space-y-5'>
                <Card className='p-0 gap-0 h-32 overflow-hidden border-none'>
                    <CardTitle className='flex items-center h-13 space-x-2 p-3 mb-0 justify-between'>
                        <div className="flex space-x-2">
                            <Maximize className='h-3 w-3 text-gray-300'/>
                            <p className='text-gray-300 text-[12px]'>TAMANHO LOG</p>
                        </div>
                    </CardTitle>
                    <CardContent className='flex h-19 bg-gray-800 items-center'>
                        <div className='flex items-end space-x-2 -mt-2'>
                            <p className='text-[35px] text-gray-300'>{tamanhoArquivo.valor}</p>
                            <p className='text-[14px] text-gray-400 mb-2.5'>{tamanhoArquivo.unidade}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className='p-5 -mt-2'>
            <Card className='p-0 gap-0 overflow-x-auto border-none'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Sheet className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>DECODE</p>
                    </div>
                </CardTitle>
                <LogTabela rows={logsProcessados ?? []}
                           semConteudo={!logId || loading}
                           analisarLog={processarConteudoLog}
                           contexto={filtroContexto}
                           aoMudarContexto={setFiltroContexto}
                           mensagem={filtroMensagem}
                           aoMudarMensagem={setFiltroMensagem}
                           onLoadMore={processarConteudoLog}
                           hasMore={hasMore}
                />
            </Card>
        </div>
    </>
}