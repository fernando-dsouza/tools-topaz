import {ParsedLog} from "@/domain/log/log.types";
import {consultaLogsPaginado, deletarLogs, insertIndex} from "@/domain/log/log.repository";

export async function salvarIndex(logs: ParsedLog[]) {
    return await insertIndex(logs)
}

export async function buscaLogsPaginados(
    offset: number, limit: number, idArquivo: number, nivel?: string[], contexto?: string, mensagem?: string
) {
    return await consultaLogsPaginado(offset, limit, idArquivo, nivel, contexto, mensagem)
}

export async function excluirLogs(idArquivo: number) {
    return await deletarLogs(idArquivo)
}
