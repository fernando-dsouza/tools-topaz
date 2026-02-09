import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Terminal, Maximize, Search, Sheet, Trash2, FileUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ChangeEvent, useEffect, useState} from "react";
import {Log} from "@/types/log";
import {LogTabela} from "@/app/log-decoder/log-tabela";
import {Spinner} from "@/components/ui/spinner";
import axios from "axios";

const formatarTamanhoArquivo = (bytes: number): { valor: string, unidade: string } => {
    if (bytes === 0) return {valor: "0", unidade: "Bytes"};

    const k = 1024;
    const tamanhos = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
        valor: parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString(),
        unidade: tamanhos[i]
    };
};

export default function LogDecode() {

    const [loading, setLoading] = useState<boolean>(false);
    const [textoLog, setTextoLog] = useState<string>('')
    const [tamanhoArquivo, setTamanhoArquivo] = useState({valor: '0', unidade: 'Bytes'});
    const [logsProcessados, setLogsProcessados] = useState<Log[]>();
    const [conteudo, setConteudo] = useState<string>('')

    const [filtroContexto, setFiltroContexto] = useState<string>('')

    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true); // Para saber se ainda há dados
    const LIMIT = 50; // Aumentei o limite para uma rolagem mais fluida

    const [logFile, setLogFile] = useState<string>();

    async function processarConteudoLog(filtro: string[], isNewSearch: boolean = true) {
        if (!logFile) return;

        const currentOffset = isNewSearch ? 0 : offset;

        try {
            const res = await axios.get("/api/log/query", {
                params: {
                    file: logFile,
                    offset: currentOffset,
                    limit: LIMIT,
                    nivel: filtro,
                    contexto: filtroContexto,
                },
                paramsSerializer: {
                    serialize: (params) => {
                        const searchParams = new URLSearchParams();

                        Object.entries(params).forEach(([key, value]) => {
                            if (value === undefined || value === null) return;

                            if (Array.isArray(value)) {
                                // Aqui forçamos a repetição da chave: nivel=Fase&nivel=Depurar
                                value.forEach(v => searchParams.append(key, v));
                            } else {
                                searchParams.append(key, String(value));
                            }
                        });

                        return searchParams.toString();
                    }
                },
            });

            const novosLogs = res.data.logs;

            if (isNewSearch) {
                setLogsProcessados(novosLogs);
                setOffset(novosLogs.length);
            } else {
                setLogsProcessados(prev => [...(prev || []), ...novosLogs]);
                setOffset(prev => prev + novosLogs.length);
            }

            // Se a API retornou menos que o limite, não há mais dados
            setHasMore(novosLogs.length === LIMIT);
        } catch (error) {
            console.error("Erro ao consultar log", error);
        }
    }

    const uploadArquivoLog = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/api/log/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setTextoLog(res.data.preview);
            setConteudo(res.data.file);
            setLogFile(res.data.file);

            if (res.data.size) {
                setTamanhoArquivo(formatarTamanhoArquivo(res.data.size));
            }

        } catch (err) {
            console.error(err);
            alert("Erro ao enviar arquivo");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    function limpar() {
        setTextoLog('');
        setLogsProcessados([]);
        setTamanhoArquivo({valor: '0', unidade: 'Bytes'});
        setConteudo('');
    }

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".txt,.log"
                onChange={uploadArquivoLog}
            />

            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Terminal className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>PREVIEW LOG</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                                onClick={() => limpar()}>
                            <Trash2/>
                            Limpar
                        </Button>
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                                onClick={() => document.getElementById('fileInput')?.click()}>
                            {loading ?
                                <Spinner/>
                                : <FileUp className='h-2 w-2'/>
                            } Upload log
                        </Button>
                    </div>
                </CardTitle>
                <CardContent className='p-0 overflow-hidden bg-black h-[76px] relative'>
                    <div className='p-3 font-mono text-[12px] text-gray-400 h-full whitespace-pre-wrap overflow-x-auto'>
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
                           semConteudo={conteudo?.length === 0}
                           analisarLog={processarConteudoLog}
                           contexto={filtroContexto}
                           aoMudarContexto={setFiltroContexto}
                           onLoadMore={processarConteudoLog}
                           hasMore={hasMore}
                />
            </Card>
        </div>
    </>
}