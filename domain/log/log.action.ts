'use server'

import {buscaLogsPaginados, excluirLogs, salvarIndex} from "@/domain/log/log.service";
import {ParsedLog} from "@/domain/log/log.types";

export async function salvarIndexAction(logs: ParsedLog[]) {
    return salvarIndex(logs)
}

export async function buscaLogsPaginadosAction(
    offset: number, limit: number, idArquivo: number, nivel?: string[], contexto?: string, mensagem?: string
) {
    return buscaLogsPaginados(offset, limit, idArquivo, nivel, contexto, mensagem)
}

export async function excluirLogsAction(idArquivo: number) {
    return excluirLogs(idArquivo)
}