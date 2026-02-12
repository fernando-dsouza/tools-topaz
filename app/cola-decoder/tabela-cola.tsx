import { memo } from "react";
import { LinhaCola } from "@/domain/cola/cola.types";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

function bordaPorTipo(tipo: string) {
    if (tipo === '1') return 'bg-blue-500/30 border-1 border-blue-500 w-9 h-7 rounded-md'
    if (tipo === '2') return 'bg-purple-500/30 border-1 border-purple-500 w-9 h-7 rounded-md'
    if (tipo === '3') return 'bg-green-500/30 border-1 border-green-500 w-9 h-7 rounded-md'
}

function textoDica(tipo: string) {
    if (tipo === '1') return 'O campo não está no MVTOS e é um campo livre, contendo apenas o valor atual.'
    if (tipo === '2') return 'O campo está no MVTOS, contendo o valor atual e o valor anterior.'
    if (tipo === '3') return 'O campo não está no MVTOS e não é um campo livre, contendo o valor atual e o valor anterior.'
}

function TabelaColaInterna({ linhas }: { linhas: LinhaCola[] }) {
    if (!linhas.length) return null

    return (
        <div className="overflow-Y-auto border border-black text-white font-mono text-sm">
            <div className='flex h-8 items-center text-[10px] justify-between p-2'>
                <div className='flex items-center space-x-1'>
                    <div className='bg-blue-500/30 border-1 border-blue-500 w-4 h-4 rounded-md'></div>
                    <p className='font-thin mt-0.5'>Está no MVTOS, é livre, contém apenas valor atual.</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <div className='bg-purple-500/30 border-1 border-purple-500 w-4 h-4 rounded-md'></div>
                    <p className='font-thin mt-0.5'>Está no MVTOS, contém valor atual e valor anterior.</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <div className='bg-green-500/30 border-1 border-green-500 w-4 h-4 rounded-md'></div>
                    <p className='font-thin mt-0.5'>Não está no MVTOS, não é livre e contém valor atual e valor
                        anterior.</p>
                </div>
            </div>

            <Table className="text-[12px]">
                <TableHeader>
                    <TableRow className='bg-gray-900 border-t-1 border-gray-600 transition-colors hover:bg-gray-900/70'>
                        <TableHead className='text-center text-gray-300'>TIPO</TableHead>
                        <TableHead className='text-center text-gray-300'>CAMPO</TableHead>
                        <TableHead className='text-center text-gray-300'>TAMANHO</TableHead>
                        <TableHead className='text-gray-300'>VALOR ATUAL</TableHead>
                        <TableHead className='text-gray-300'>VALOR ANTERIOR</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {linhas.map((linha, indice) => (
                        <TableRow key={indice}
                            className='border-gray-600 transition-colors hover:bg-blue-800/10'>
                            <TableCell className='flex items-center justify-center'>
                                <div className={`flex items-center justify-center cursor-help ${bordaPorTipo(linha.tipo)}`}>
                                    <HoverCard openDelay={100} closeDelay={300}>
                                        <HoverCardTrigger>[{linha.tipo}]</HoverCardTrigger>
                                        <HoverCardContent>
                                            {textoDica(linha.tipo)}
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </TableCell>
                            <TableCell className='text-center'>[{linha.campo}]</TableCell>
                            <TableCell className='text-center'>[{linha.tamanho.toString().padStart(3, '0')}]</TableCell>
                            <TableCell>[{linha.valorAtual}]</TableCell>
                            <TableCell className='pr-4'>[{linha.valorAnterior}]</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption className='mb-1 text-[11px]'>Fim dos valores decodificados</TableCaption>
            </Table>
        </div>
    )
}

export const TabelaCola = memo(TabelaColaInterna);
