'use client';

import { ChangeEvent, useCallback, useState } from "react";
import { useArmazenamentoLocal } from "@/hooks/use-armazenamento-local";
import { LogProcessado } from "@/domain/log/log.types";
import { buscarLogsPaginados, excluirLogs, salvarLogs } from "@/domain/log/log.service";
import { criarProcessadorLogNavegador } from "@/domain/log/log-stream-parser.service";
import { formatarTamanhoArquivo } from "@/domain/log/log.utils";
import notificacao from "@/components/notificacao";

const LIMITE = 500;
const TAMANHO_LOTE = 2000;
const LIMITE_PREVIA = 200;

export function useDecodificadorLog() {
    const [carregando, definirCarregando] = useState(false);
    const [carregandoExclusao, definirCarregandoExclusao] = useState(false);
    const [logsProcessados, definirLogsProcessados] = useState<LogProcessado[]>();
    const [filtroContexto, definirFiltroContexto] = useState('');
    const [filtroMensagem, definirFiltroMensagem] = useState('');
    const [filtroLinhaInicio, definirFiltroLinhaInicio] = useState<number | undefined>(undefined);
    const [filtroQuantidade, definirFiltroQuantidade] = useState<number | undefined>(undefined);
    const [progresso, definirProgresso] = useState(0);
    const [deslocamento, definirDeslocamento] = useState(0);
    const [temMais, definirTemMais] = useState(true);

    const [tamanhoArquivo, definirTamanhoArquivo] = useArmazenamentoLocal('tamanhoArquivo', { valor: '0', unidade: 'Bytes' });
    const [nomeArquivo, definirNomeArquivo] = useArmazenamentoLocal('nomeArquivo', '');
    const [textoLog, definirTextoLog] = useArmazenamentoLocal('stringTextoLog', '');
    const [idLog, definirIdLog] = useArmazenamentoLocal<number | null>('stringLogIdArquivo', null);

    const processarConteudoLog = useCallback(async (filtro: string[], novaBusca: boolean = true) => {
        if (!idLog) return;

        const deslocamentoAtual = novaBusca ? 0 : deslocamento;

        let linhaFimCalculada: number | undefined = undefined;
        if (filtroLinhaInicio !== undefined && filtroQuantidade !== undefined) {
            linhaFimCalculada = filtroLinhaInicio + filtroQuantidade;
        }

        try {
            const novosLogs = await buscarLogsPaginados(
                deslocamentoAtual, LIMITE, idLog, filtro, filtroContexto, filtroMensagem, filtroLinhaInicio, linhaFimCalculada
            );

            if (novaBusca) {
                definirLogsProcessados(novosLogs);
                definirDeslocamento(novosLogs.length);
            } else {
                definirLogsProcessados(prev => [...(prev || []), ...novosLogs]);
                definirDeslocamento(prev => prev + novosLogs.length);
            }

            definirTemMais(novosLogs.length === LIMITE);
        } catch (err) {
            notificacao('erro', `Erro ao consultar log: ${err}`);
        }
    }, [idLog, deslocamento, filtroContexto, filtroMensagem, filtroLinhaInicio, filtroQuantidade]);

    const uploadArquivoLog = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;

        if (idLog) await limpar();

        const tamanho = formatarTamanhoArquivo(arquivo.size);
        definirTamanhoArquivo(tamanho);
        definirNomeArquivo(arquivo.name);

        definirCarregando(true);
        definirProgresso(0);

        const idArquivo = Date.now();
        definirIdLog(Number(idArquivo));

        const leitor = arquivo.stream().getReader();
        const decodificador = new TextDecoder("latin1");
        const processador = criarProcessadorLogNavegador(idArquivo);

        let lote: LogProcessado[] = [];
        let bytesProcessados = 0;

        async function salvarLote() {
            if (lote.length === 0) return;
            const paraEnviar = lote;
            lote = [];
            await salvarLogs(paraEnviar);
        }

        let bufferPrevia = '';
        let previaConcluida = false;

        try {
            while (true) {
                const { done, value } = await leitor.read();
                if (done) break;

                bytesProcessados += value.length;
                const pedaco = decodificador.decode(value, { stream: true });

                if (!previaConcluida) {
                    bufferPrevia += pedaco;
                    if (bufferPrevia.length >= LIMITE_PREVIA) {
                        definirTextoLog(bufferPrevia.slice(0, LIMITE_PREVIA));
                        previaConcluida = true;
                    }
                }

                processador.adicionar(pedaco, (log) => {
                    lote.push(log);
                });

                if (lote.length >= TAMANHO_LOTE) {
                    await salvarLote();
                }

                definirProgresso(Math.round((bytesProcessados / arquivo.size) * 100));
            }

            if (lote.length > 0) {
                await salvarLote();
            }

            if (!previaConcluida && bufferPrevia.length > 0) {
                definirTextoLog(bufferPrevia.slice(0, LIMITE_PREVIA));
            }

            await processarConteudoLog([], true);

            notificacao('sucesso', "Log processado localmente!");
        } catch (err) {
            notificacao('erro', `Erro no processamento: ${err}`);
        } finally {
            definirCarregando(false);
            e.target.value = '';
        }
    }, [idLog, processarConteudoLog]);

    const limpar = useCallback(async () => {
        try {
            definirCarregandoExclusao(true);
            if (idLog) {
                await excluirLogs(idLog);
            }
            definirIdLog(null);
            definirNomeArquivo('');
            definirTextoLog('');
            definirLogsProcessados([]);
            definirTamanhoArquivo({ valor: '0', unidade: 'Bytes' });
            definirDeslocamento(0);
            definirTemMais(true);

            notificacao('sucesso', "Dados e preview limpos com sucesso!");
        } catch (err) {
            notificacao('erro', `Erro ao limpar dados: ${err}`);
        } finally {
            definirCarregandoExclusao(false);
        }
    }, [idLog, definirIdLog, definirTextoLog, definirTamanhoArquivo]);

    return {
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
    };
}
