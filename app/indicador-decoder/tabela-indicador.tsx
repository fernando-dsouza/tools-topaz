import { memo } from "react";
import {
    Table,
    TableBody, TableCaption,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Indicador } from "@/domain/indicador/indicador.types";

function TabelaIndicadorInterna({ indicadores, colunas }: { indicadores: Indicador[][], colunas: number }) {
    if (!indicadores.length) return null

    return (
        <div className="flex flex-col items-center justify-center w-full p-4 font-mono text-sm text-white">
            <div className="border border-black overflow-hidden">
                <Table className="w-auto border-separate border-spacing-1">
                    <TableBody>
                        {indicadores.map((bits, indice) => (
                            <TableRow key={indice} className="border-gray-600 transition-colors hover:bg-blue-800/10">
                                {bits.map((bit, nBit) => {
                                    const numeroGlobal = (indice * colunas) + nBit + 1;

                                    return (
                                        <TableCell
                                            key={nBit}
                                            title={`Bit ${numeroGlobal}`}
                                            className={`border border-gray-700 p-0 text-center h-10 w-10 min-w-[40px] 
                                                        rounded-lg cursor-default ${bit.valor === '1'
                                                    ? 'border-1 border-blue-500 bg-blue-500/20 text-blue-400 font-bold'
                                                    : 'text-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center w-full h-full">
                                                {numeroGlobal}
                                            </div>
                                        </TableCell>
                                    )
                                })}

                                {bits.length < colunas && Array.from({ length: colunas - bits.length }).map((_, indiceVazio) => (
                                    <TableCell
                                        key={`vazio-${indiceVazio}`}
                                        className="border border-gray-700 p-0 h-10 w-10 min-w-[40px]"
                                    />
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption className='mb-1 text-[11px]'>Fim dos valores decodificados</TableCaption>
                </Table>
            </div>
        </div>
    )
}

export const TabelaIndicador = memo(TabelaIndicadorInterna);
