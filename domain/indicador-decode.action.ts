'use server'


import {analisarIndicador} from "@/domain/indicador-decode.service";

export async function analisarIndicadorAction(indicador: string, colunas: number) {
    return analisarIndicador(indicador, colunas)
}