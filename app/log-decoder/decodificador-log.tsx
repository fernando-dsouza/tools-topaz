import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Terminal, Maximize, Sheet, Trash2, FileUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabelaLog } from "@/app/log-decoder/tabela-log";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { useDecodificadorLog } from "@/app/log-decoder/hooks/use-decodificador-log";

export default function DecodificadorLog() {
    const {
        carregando,
        carregandoExclusao,
        logsProcessados,
        filtroContexto,
        definirFiltroContexto,
        filtroMensagem,
        definirFiltroMensagem,
        filtroLinhaInicio,
        definirFiltroLinhaInicio,
        filtroQuantidade,
        definirFiltroQuantidade,
        progresso,
        temMais,
        tamanhoArquivo,
        nomeArquivo,
        textoLog,
        idLog,
        processarConteudoLog,
        uploadArquivoLog,
        limpar,
    } = useDecodificadorLog();

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <input
                type="file"
                id="entradaArquivo"
                className="hidden"
                accept=".log,.txt"
                onChange={uploadArquivoLog}
            />

            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Terminal className='h-3 w-3 text-gray-300' />
                        <p className='text-gray-300 text-[12px]'>PRÉ-VISUALIZAÇÃO DO LOG</p>
                    </div>
                    <div className="flex space-x-2">
                        {carregando && <div className='flex items-center space-x-1 text-gray-300 mr-2 text-[11px]'>
                            <p>{progresso}%</p>
                            <Progress value={progresso} className='w-15 mt-0.5' />
                        </div>}
                        {!carregando && !carregandoExclusao && nomeArquivo && <div className='flex items-center space-x-1 text-gray-300 mr-3 text-[12px]'>
                            <p className="text-gray-400">{nomeArquivo}</p>
                        </div>}
                        {carregandoExclusao && <div className='flex items-center space-x-1 text-gray-300 mr-3 text-[11px]'>
                            <Spinner />
                            <p>Limpando logs...</p>
                        </div>}
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                            onClick={() => limpar()}
                            disabled={carregando}>
                            <Trash2 />
                            Limpar
                        </Button>
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                            onClick={() => document.getElementById('entradaArquivo')?.click()}
                            disabled={carregando}>
                            <div className='flex items-center space-x-1'>
                                {carregando ? <Spinner /> : <FileUp className='h-2 w-2' />}
                                <p>Carregar log</p>
                            </div>
                        </Button>
                        <div className="flex space-x-2 items-center bg-blue-600/50 rounded-md px-2">
                            <Info className='h-4 w-4 text-white' />
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
                            <Maximize className='h-3 w-3 text-gray-300' />
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
            <Card className='p-0 gap-0 border-none rounded-lg overflow-hidden'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Sheet className='h-3 w-3 text-gray-300' />
                        <p className='text-gray-300 text-[12px]'>DECODIFICAR</p>
                    </div>
                </CardTitle>
                <TabelaLog linhas={logsProcessados ?? []}
                    semConteudo={!idLog}
                    analisarLog={processarConteudoLog}
                    contexto={filtroContexto}
                    aoMudarContexto={definirFiltroContexto}
                    mensagem={filtroMensagem}
                    aoMudarMensagem={definirFiltroMensagem}
                    filtroLinhaInicio={filtroLinhaInicio}
                    aoMudarFiltroLinhaInicio={definirFiltroLinhaInicio}
                    filtroQuantidade={filtroQuantidade}
                    aoMudarFiltroQuantidade={definirFiltroQuantidade}
                    aoCarregarMais={processarConteudoLog}
                    temMais={temMais}
                />
            </Card>
        </div>
    </>
}
