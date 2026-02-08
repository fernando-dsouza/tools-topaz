type ParsedLog = {
    offset: number;
    length: number;
    data: string;
    hora: string;
    nivel: string;
    contexto: string;
};

type OnLogFound = (log: ParsedLog) => void;

export function createLogStreamParser() {
    let buffer = "";
    let bufferOffset = 0;

    // Regex do seu log (a mesma que você já usa)
    const logRegex =
        /^(\d{2}\/\d{2}\/\d{4})\s(\d{2}:\d{2}:\d{2}\s\d{3})\s(\w+):\[(.*?)\]\s([\s\S]*?)(?=\n\d{2}\/\d{2}\/\d{4}|$)/gm;

    function push(chunk: Buffer, chunkOffset: number, onLogFound: OnLogFound) {
        buffer += chunk.toString("utf8");

        let match: RegExpExecArray | null;

        while ((match = logRegex.exec(buffer)) !== null) {
            const fullMatch = match[0];
            const startIndex = match.index;

            const absoluteOffset = bufferOffset + startIndex;

            onLogFound({
                offset: absoluteOffset,
                length: Buffer.byteLength(fullMatch),
                data: match[1],
                hora: match[2],
                nivel: match[3],
                contexto: match[4],
                mensagem: match[5].trim(),
            } as any);
        }

        // Remove o que já foi processado (mantém só o final incompleto)
        const lastMatchEnd = logRegex.lastIndex;
        if (lastMatchEnd > 0) {
            buffer = buffer.slice(lastMatchEnd);
            bufferOffset += lastMatchEnd;
            logRegex.lastIndex = 0;
        }
    }

    return {
        push,
    };
}
