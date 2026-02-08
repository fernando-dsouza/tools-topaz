import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Clipboard, Binary, Maximize, Search, Trash2, Sheet} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Progress} from "@/components/ui/progress";
import {useEffect, useState} from "react";
import {analizarColaAction} from "@/domain/cola/cola-decode.action";
import {ColaRow} from "@/types/cola";
import ColaTable from "@/app/cola-decoder/cola-tabela";

export default function ColaDecode() {

    const [texto, setTexto] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const salvo = localStorage.getItem('stringCola');
            try {
                return salvo ? JSON.parse(salvo) : '';
            } catch (err) {
                console.error(err)
                return '';
            }
        }
        return '';
    });

    const [dadosCola, setDadosCola] = useState<ColaRow[]>()

    async function buscaTextoAreaTransferencia() {
        const text = await navigator.clipboard.readText();
        setTexto(text);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (texto) {
                localStorage.setItem('stringCola', JSON.stringify(texto))
            }
        }, 500);

        return () => clearTimeout(timer)
    }, [texto])

    async function analisarCola(cola: string, largocola: number) {
        const dadosCola = await analizarColaAction(cola, largocola)
        setDadosCola(dadosCola)
    }

    const tamanhoTexto = texto.length
    const percentual = (tamanhoTexto * 100) / 5000

    return <>
        <div className='flex justify-between gap-5 p-5'>
            <Card className='p-0 gap-0 h-fit overflow-hidden border-none w-full'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Binary className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>STRING COLA</p>
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
                    </div>
                </CardTitle>
                <CardContent className='p-0'>
                    <Textarea
                        className='rounded-none bg-black text-gray-100 h-[144px] border-none'
                        value={texto}
                        placeholder='Cole o texto do campo "COLA" aqui...'
                        onChange={(e) => setTexto(e.target.value)}/>
                </CardContent>
            </Card>

            <div className='w-[300px] space-y-5'>
                <Card className='p-0 gap-0 h-32 overflow-hidden border-none'>
                    <CardTitle className='flex items-center h-26 space-x-2 p-3 mb-0 justify-between'>
                        <div className="flex space-x-2">
                            <Maximize className='h-3 w-3 text-gray-300'/>
                            <p className='text-gray-300 text-[12px]'>LARGURA STRING</p>
                        </div>
                    </CardTitle>
                    <CardContent className='px-4 pb-4 bg-gray-800'>
                        <div className='flex items-end space-x-2'>
                            <p className='text-[35px] text-gray-300'>{tamanhoTexto}</p>
                            <p className='text-[14px] text-gray-400 mb-2.5'>Chars</p>
                        </div>
                        <Progress value={percentual} className="bg-primary"/>
                    </CardContent>
                </Card>

                <Button className='bg-blue-500 h-12 w-full cursor-pointer'
                        onClick={() => analisarCola(texto, tamanhoTexto)}>
                    <Search/>
                    Analisar COLA
                </Button>
            </div>
        </div>

        <div className='p-5 -mt-2'>
            <Card className='p-0 gap-0 h-fit overflow-hidden border-none'>
                <CardTitle className='flex items-center space-x-2 p-3 mb-0 justify-between'>
                    <div className="flex space-x-2">
                        <Sheet className='h-3 w-3 text-gray-300'/>
                        <p className='text-gray-300 text-[12px]'>DECODE</p>
                    </div>
                </CardTitle>
                <ColaTable rows={dadosCola ?? []}/>
            </Card>
        </div>
    </>
}