import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Clipboard, ClipboardPaste, Search, Trash2, Sheet} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {analizarColaAction} from "@/domain/cola-decode.action";
import {ColaRow} from "@/types/cola";
import ColaTable from "@/app/components/cola-tabela";
import {Input} from "@/components/ui/input";
import {analisarIndicadorAction} from "@/domain/indicador-decode.action";
import {Indicador} from "@/types/indicador";
import IndicadorTable from "@/app/components/indicador-tabela";

const COLUNAS = 25

export default function IndicadorDecode() {

    const [colunas, setColunas] = useState<number>(COLUNAS);
    const [texto, setTexto] = useState("");
    const [dadosIndicador, setDadosIndicador] = useState<Indicador[][]>()

    async function buscaTextoAreaTransferencia() {
        const text = await navigator.clipboard.readText();
        setTexto(text);
    }

    async function analisarIndicador(indicador: string) {
        const dadosIndicador = await analisarIndicadorAction(indicador, COLUNAS)
        setDadosIndicador(dadosIndicador)
    }

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <ClipboardPaste className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>STRING MOV-INDICATORS</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                                onClick={() => setTexto('')}>
                            <Trash2/>
                            Limpar
                        </Button>
                        <Button className='bg-gray-100/10 cursor-pointer h-7 text-[12px] text-gray-300'
                                onClick={() => buscaTextoAreaTransferencia()}>
                            <Clipboard className='h-2 w-2'/>
                            Colar
                        </Button>
                        <Button className='bg-blue-500 h-7 cursor-pointer'
                                onClick={() => analisarIndicador(texto)}>
                            <Search/>
                            Analisar Indicador
                        </Button>
                    </div>
                </CardTitle>
                <CardContent className='p-0'>
                    <Input
                        className='border-none bg-black text-white rounded-none h-10'
                        type='text'
                        value={texto}
                        placeholder='Cole o indicador aqui...'
                        onChange={(e) => setTexto(e.target.value)}/>
                </CardContent>
            </Card>
        </div>

        <div className='flex p-5 -mt-2 items-center justify-center'>
            <Card className='p-0 gap-0 h-fit w-fit overflow-hidden border-none'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between space-x-20'>
                    <div className="flex space-x-2">
                        <Sheet className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>DECODE</p>
                    </div>
                    <div className='flex items-center space-x-2 text-[12px] text-gray-300'>
                        <p>COLUNAS</p>
                        <Input type="number"
                               value={colunas}
                               onChange={(e) => setColunas(Number(e.target.value))}
                               className="w-14 h-8 bg-gray-800 border-gray-600 text-white text-center
                                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                                          [&::-webkit-inner-spin-button]:appearance-none focus:ring-blue-500
                                          focus:border-blue-500 text-white"
                               placeholder="0"/>
                    </div>
                </CardTitle>
                <IndicadorTable indicadores={dadosIndicador ?? []} colunas={colunas}/>
            </Card>
        </div>
    </>
}