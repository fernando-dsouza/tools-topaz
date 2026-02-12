import Dexie from 'dexie';
import { db } from "@/domain/log/log.db";
import { LogProcessado } from "@/domain/log/log.types";

export async function salvarLogs(logs: LogProcessado[]) {
    if (!logs.length) return;
    await db.logs.bulkAdd(logs);
}

export async function buscarLogsPaginados(
    deslocamento: number,
    limite: number,
    idArquivo: number,
    niveis?: string[],
    contexto?: string,
    mensagem?: string,
    linhaInicio?: number,
    linhaFim?: number
) {
    let limiteInferior = [idArquivo, Dexie.minKey];
    let limiteSuperior = [idArquivo, Dexie.maxKey];

    let nomeIndice = '[idArquivo+indice]';

    if ((linhaInicio !== undefined && linhaInicio !== null) || (linhaFim !== undefined && linhaFim !== null)) {
        nomeIndice = '[idArquivo+linha]';
        limiteInferior = [idArquivo, linhaInicio ?? Dexie.minKey];
        limiteSuperior = [idArquivo, linhaFim ?? Dexie.maxKey];
    }

    let colecao = db.logs
        .where(nomeIndice)
        .between(limiteInferior, limiteSuperior, true, true);

    if (niveis && niveis.length > 0) {
        colecao = colecao.filter(log => niveis.includes(log.nivel));
    }

    if (contexto) {
        const contextoMinusculo = contexto.toLowerCase();
        colecao = colecao.filter(log => log.contexto.toLowerCase().includes(contextoMinusculo));
    }

    if (mensagem) {
        const mensagemMinusculo = mensagem.toLowerCase();
        colecao = colecao.filter(log => log.mensagem.toLowerCase().includes(mensagemMinusculo));
    }

    const logs = await colecao
        .offset(deslocamento)
        .limit(limite)
        .toArray();

    return logs;
}

export async function excluirLogs(idArquivo: number) {
    if (!idArquivo) throw new Error('ID do arquivo é obrigatório');

    await db.logs.clear();
}
