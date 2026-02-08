'use client'

import {Binary, MousePointer2, Terminal} from "lucide-react"
import ColaDecode from "@/app/cola-decoder/cola-decode";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import IndicadorDecode from "@/app/indicador-decoder/indicador-decode";
import LogDecode from "@/app/log-decoder/log-decode";


export default function TopazToolsCliente() {

    const [mounted, setMounted] = useState(false);

    const [tab, setTab] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const salvo = localStorage.getItem('ultimoTab');
            try {
                return salvo ? JSON.parse(salvo) : 'cola-decoder';
            } catch {
                return 'cola-decoder';
            } finally {
                setMounted(true)
            }
        }
        return 'cola-decoder';
    });

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('ultimoTab', JSON.stringify(tab));
        }
    }, [tab, mounted]);

    // if (!mounted) return <div className="h-screen bg-primary"/>;

    return <>
        <div className="flex h-16 bg-primary py-3 px-5 items-center justify-between">
            <div className='flex space-x-2 items-center'>
                <div className='flex items-center justify-center h-10 w-10 rounded-md bg-blue-400/20'>
                    {tab === 'cola-decoder'
                        ? <Binary className='text-blue-500'/>
                        : <MousePointer2 className='text-blue-500'/>
                    }
                </div>
                <div>
                    <p className='text-gray-300 font-semibold'>TOPAZ Tools</p>
                    <p className='-mt-1 text-gray-400 text-[10px] font-semibold'>
                        {tab === 'cola-decoder'
                            ? 'Cola Decoder'
                            : 'Indicador Decoder'}
                    </p>
                </div>
            </div>

            {!mounted
                ? ''
                : <div className="flex space-x-2">
                    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
                        <TabsList className='space-x-2 px-1 pb-1 bg-gray-300'>
                            <TabsTrigger
                                value="cola-decoder"
                                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer"
                                asChild>
                                <div>
                                    <Binary className="w-4 h-4 text-blue-500"/>
                                    COLA decoder
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="indicador-decoder"
                                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer"
                                asChild>
                                <div>
                                    <MousePointer2 className="w-4 h-4 text-blue-500"/>
                                    Indicador decoder
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="log-decoder"
                                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer"
                                asChild>
                                <div>
                                    <Terminal className="w-4 h-4 text-blue-500"/>
                                    Log decoder
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>}
        </div>

        {!mounted
            ? ''
            : <>
                {tab === 'cola-decoder' && <ColaDecode/>}
                {tab === 'indicador-decoder' && <IndicadorDecode/>}
                {tab === 'log-decoder' && <LogDecode/>}
            </>
        }
    </>
}
