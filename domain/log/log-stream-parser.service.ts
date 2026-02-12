import { LogProcessado } from "@/domain/log/log.types";

export function criarProcessadorLogNavegador(idArquivo: number) {
    let buffer = "";
    let deslocamentoBuffer = 0;
    let indiceGlobal = 0
    let numeroLinhaAtual = 1;
    const codificador = new TextEncoder();

    const regexLog = /^(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2}\s+\d{3})\s+([^:]+):\[(.*?)\]\s*([\s\S]*?)(?:\r?\n(?=\d{2}\/\d{2}\/\d{4})|$)/gm;

    function contarQuebrasDeLinha(texto: string): number {
        return (texto.match(/\n/g) || []).length;
    }

    function adicionar(pedacoTexto: string, aoEncontrarLog: (log: LogProcessado) => void) {
        buffer += pedacoTexto;

        let correspondencia: RegExpExecArray | null;
        let ultimoIndice = 0;

        while ((correspondencia = regexLog.exec(buffer)) !== null) {
            indiceGlobal += 1
            const correspondenciaCompleta = correspondencia[0];
            const indiceInicio = correspondencia.index;

            const textoAntesDaCorrespondencia = buffer.slice(ultimoIndice, indiceInicio);
            const linhasAntes = contarQuebrasDeLinha(textoAntesDaCorrespondencia);

            numeroLinhaAtual += linhasAntes;

            const linhaLog = numeroLinhaAtual;

            const linhasNaCorrespondencia = contarQuebrasDeLinha(correspondenciaCompleta);
            numeroLinhaAtual += linhasNaCorrespondencia;

            const bytes = codificador.encode(correspondenciaCompleta);

            aoEncontrarLog({
                idArquivo: idArquivo,
                deslocamento: deslocamentoBuffer + indiceInicio,
                comprimento: bytes.length,
                data: correspondencia[1],
                hora: correspondencia[2],
                nivel: correspondencia[3],
                contexto: correspondencia[4],
                mensagem: correspondencia[5].trim(),
                indice: indiceGlobal,
                linha: linhaLog
            });
            ultimoIndice = regexLog.lastIndex;
        }

        if (ultimoIndice > 0) {
            buffer = buffer.slice(ultimoIndice);
            deslocamentoBuffer += ultimoIndice;
            regexLog.lastIndex = 0;
        }
    }

    return { adicionar };
}
