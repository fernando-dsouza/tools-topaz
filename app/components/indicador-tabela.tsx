import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {Indicador} from "@/types/indicador";

export default function IndicadorTable({indicadores, colunas}: { indicadores: Indicador[][], colunas: number }) {
    if (!indicadores.length) return null

    return (
        <div className="flex flex-col items-center justify-center w-full p-4 font-mono text-sm text-white">
            <div className="border border-black overflow-hidden">
                <Table className="w-auto border-separate border-spacing-1">
                    <TableBody>
                        {indicadores.map((bits, i) => (
                            <TableRow key={i} className="border-gray-600 transition-colors hover:bg-blue-800/10">
                                {bits.map((bit, nBit) => {
                                    const numeroGlobal = (i * colunas) + nBit + 1;

                                    return (
                                        <TableCell
                                            key={nBit}
                                            className={`border border-gray-700 p-0 text-center h-10 w-10 min-w-[40px] 
                                                        rounded-lg ${
                                                bit.valor === '1' ? 'border-1 border-blue-500 bg-blue-500/20' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-center w-full h-full">
                                                {numeroGlobal}
                                            </div>
                                        </TableCell>
                                    )
                                })}

                                {/* Preenchimento para manter a forma quadrada mesmo em linhas incompletas */}
                                {bits.length < colunas && Array.from({length: colunas - bits.length}).map((_, emptyIdx) => (
                                    <TableCell
                                        key={`empty-${emptyIdx}`}
                                        className="border border-gray-700 p-0 h-10 w-10 min-w-[40px]"
                                    />
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="mt-2 text-xs text-gray-400">Fim dos valores decodificados</p>
        </div>
    )
}
