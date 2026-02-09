import {ParsedLog} from "@/domain/log/log.types";

export function createLogBrowserParser(fileId: string) {
    let buffer = "";
    let bufferOffset = 0;
    let globalIndex = 0
    const encoder = new TextEncoder();

    // Regex levemente ajustada para garantir captura no streaming
    const logRegex = /^(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2}\s+\d{3})\s+([^:]+):\[(.*?)\]\s*([\s\S]*?)(?:\r?\n(?=\d{2}\/\d{2}\/\d{4})|$)/gm;

    function push(chunkStr: string, onLogFound: (log: ParsedLog) => void) {
        buffer += chunkStr;

        let match: RegExpExecArray | null;
        let lastIndex = 0;

        while ((match = logRegex.exec(buffer)) !== null) {
            globalIndex += 1
            const fullMatch = match[0];
            const startIndex = match.index;

            // No browser, usamos TextEncoder para saber o tamanho real em bytes
            const bytes = encoder.encode(fullMatch);

            onLogFound({
                id_arquivo: fileId,
                offset: bufferOffset + startIndex,
                length: bytes.length,
                data: match[1],
                hora: match[2],
                nivel: match[3],
                contexto: match[4],
                mensagem: match[5].trim(),
                index: globalIndex
            });
            lastIndex = logRegex.lastIndex;
        }

        // Remove do buffer apenas o que já foi processado
        if (lastIndex > 0) {
            buffer = buffer.slice(lastIndex);
            bufferOffset += lastIndex;
            logRegex.lastIndex = 0;
        }
    }

    return {push};
}

