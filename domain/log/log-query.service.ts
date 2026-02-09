import fs from "fs";
import path from "path";
import {LogIndexEntry} from "./log-index.service";

interface QueryParams {
    file: string;
    nivel?: string[];       // múltiplos níveis
    contexto?: string;
    mensagem?: string;
    offset?: number;
    limit?: number;
}

export async function queryLog({
                                   file,
                                   nivel,
                                   contexto,
                                   mensagem,
                                   offset = 0,
                                   limit = 100,
                               }: QueryParams) {
    const logsDir = path.join(process.cwd(), "logs");

    const logPath = path.join(logsDir, file);
    const indexPath = `${logPath}.index.json`;

    if (!fs.existsSync(logPath)) {
        throw new Error("Arquivo de log não encontrado");
    }

    if (!fs.existsSync(indexPath)) {
        throw new Error("Index não encontrado");
    }

    // 📌 índice é leve → pode ficar em memória
    const index: LogIndexEntry[] = JSON.parse(
        await fs.promises.readFile(indexPath, "utf-8")
    );

    console.log(contexto, mensagem)

    // 🔍 filtro inicial (somente metadados)
    const filtered = index.filter((entry) => {
        if (nivel && nivel.length > 0
            && !nivel.some((n) => n.toLowerCase() === entry.nivel.toLowerCase())) {
            return false;
        }

        if (contexto && !entry.contexto.toLowerCase().includes(contexto.toLowerCase())) {
            return false;
        }

        return true;
    });

    const total = filtered.length;

    // 📄 paginação baseada no índice
    const page = filtered.slice(offset, offset + limit);

    // 📖 leitura pontual do arquivo
    const fd = await fs.promises.open(logPath, "r");

    const logs = [];

    try {
        for (const entry of page) {
            const buffer = Buffer.alloc(entry.length);

            await fd.read(
                buffer,
                0,
                entry.length,
                entry.offset
            );

            const raw = buffer.toString("utf-8");

            logs.push({
                data: entry.data,
                hora: entry.hora,
                nivel: entry.nivel,
                contexto: entry.contexto,
                mensagem: raw.split("] ")[1]?.trim() ?? raw,
            });
        }
    } finally {
        await fd.close();
    }

    return {
        total,
        offset,
        limit,
        logs,
    };
}
