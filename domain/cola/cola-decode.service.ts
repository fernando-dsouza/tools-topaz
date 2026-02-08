import {ColaRow} from "@/types/cola";


export function ordenarPorCampo(rows: ColaRow[]): ColaRow[] {
    return [...rows].sort((a, b) => {
        const aEmpty = isEmptyRow(a)
        const bEmpty = isEmptyRow(b)

        if (aEmpty && !bEmpty) return 1
        if (!aEmpty && bEmpty) return -1
        if (aEmpty && bEmpty) return 0

        return a.campo.localeCompare(b.campo, undefined, {
            numeric: true,
            sensitivity: 'base',
        })
    })
}

export function isEmptyRow(row: ColaRow): boolean {
    return (
        !row.tipo &&
        !row.campo &&
        row.largo === 0 &&
        !row.valorAtual &&
        !row.valorAnterior
    )
}

export function isVisibleRow(row: ColaRow): boolean {
    return !isEmptyRow(row);
}

export function analizarCola(
    cola: string,
    largocola: number
): ColaRow[] {
    let indice = 1
    let largo5 = false
    const rows: ColaRow[] = []

    while (indice < largocola && cola !== '') {
        let parte = cola.substring(indice - 1, indice)

        if (!['1', '2', '3'].includes(parte)) {
            largo5 = true
            indice++
            parte = cola.substring(indice - 1, indice)
        }

        const tipo = parte
        indice++

        const campo = largo5
            ? cola.substring(indice - 1, indice + 4)
            : cola.substring(indice - 1, indice + 3)

        indice += largo5 ? 5 : 4

        const largoStr = cola.substring(indice - 1, indice + 2)
        const largo = parseInt(largoStr.trim()) || 0
        indice += 3

        let valorAtual = ''
        let valorAnterior = ''

        if (largo > 0) {
            const valor = cola.substring(indice - 1, indice - 1 + largo)

            if (tipo === '1') valorAtual = valor
            if (tipo === '2') valorAnterior = valor

            if (tipo === '3') {
                valorAtual = valor
                indice += largo
                valorAnterior = cola.substring(indice - 1, indice - 1 + largo)
            }

            indice += largo
        }

        rows.push({tipo, campo, largo, valorAtual, valorAnterior})
    }

    return rows
}
