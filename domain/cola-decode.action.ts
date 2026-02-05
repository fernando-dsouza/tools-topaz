'use server'

import {analizarCola, isVisibleRow, ordenarPorCampo} from "@/domain/cola-decode.service";
import {ColaRow} from "@/types/cola";

export async function analizarColaAction(
    cola: string,
    largocola: number
): Promise<ColaRow[]> {
    const analisado = analizarCola(cola, largocola)
    const ordenado = ordenarPorCampo(analisado)

    // 👇 filtro final automático
    return ordenado.filter(isVisibleRow)
}
