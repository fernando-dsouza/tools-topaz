import Dexie, { Table } from 'dexie';
import { LogProcessado } from "@/domain/log/log.types";

export interface EntidadeLog extends LogProcessado {
    id?: number;
}

export class BancoDeDadosFerramentas extends Dexie {
    logs!: Table<EntidadeLog>;

    constructor() {
        super('BancoDeDadosFerramentas');
        this.version(1).stores({
            logs: '++id, idArquivo, nivel, contexto, mensagem, [idArquivo+indice], [idArquivo+linha]'
        });
    }
}

export const db = new BancoDeDadosFerramentas();
