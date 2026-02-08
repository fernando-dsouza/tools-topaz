import fs from "fs";
import path from "path";

export type LogIndexEntry = {
    offset: number;
    length: number;
    data: string;
    hora: string;
    nivel: string;
    contexto: string;
};

export function createLogIndex(logId: string) {
    const indexPath = path.join(process.cwd(), "logs", `${logId}.index.json`);

    const entries: LogIndexEntry[] = [];

    function add(entry: LogIndexEntry) {
        entries.push(entry);
    }

    async function save() {
        await fs.promises.writeFile(
            indexPath,
            JSON.stringify(entries),
            "utf-8"
        );
    }

    async function load(): Promise<LogIndexEntry[]> {
        const content = await fs.promises.readFile(indexPath, "utf-8");
        return JSON.parse(content);
    }

    return {
        add,
        save,
        load,
        indexPath,
    };
}
