'use client'

import {Binary, MousePointer2} from "lucide-react"
import ColaDecode from "@/app/(topaz-tools)/cola-decode";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import IndicadorDecode from "@/app/(topaz-tools)/indicador-decode";


export default function TopazToolsCliente() {

    const [tab, setTab] = useState<string>('cola-decoder')

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

            <div className="flex space-x-2">
                <Tabs defaultValue="cola-decoder" onValueChange={(value) => setTab(value)}>
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
                    </TabsList>
                </Tabs>
            </div>
        </div>

        {tab === 'cola-decoder' && <ColaDecode/>}
        {tab === 'indicador-decoder' && <IndicadorDecode/>}
    </>
}
