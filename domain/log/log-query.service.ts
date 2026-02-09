import fs from "fs";
import path from "path";
import {LogIndexEntry} from "./log-index.service";

interface QueryParams {
    file: string;
    nivel?: string[];
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
    const indexPath = `${logPath}`;

    if (!fs.existsSync(indexPath)) {
        throw new Error("Index não encontrado");
    }

    const index: LogIndexEntry[] = JSON.parse(
        await fs.promises.readFile(indexPath, "utf8")
    );

    const filtered = index.filter((entry) => {
        if (nivel?.length &&
            !nivel.some(n => n.toLowerCase() === entry.nivel.toLowerCase())) {
            return false;
        }

        if (contexto &&
            !entry.contexto.toLowerCase().includes(contexto.toLowerCase())) {
            return false;
        }

        if (mensagem &&
            !entry.mensagem.toLowerCase().includes(mensagem.toLowerCase())) {
            return false;
        }

        return true;
    });

    const total = filtered.length;

    const logs = filtered
        .slice(offset, offset + limit)
        .map(entry => ({
            data: entry.data,
            hora: entry.hora,
            nivel: entry.nivel,
            contexto: entry.contexto,
            mensagem: entry.mensagem,
        }));

    return {
        total,
        offset,
        limit,
        logs,
    };
}

