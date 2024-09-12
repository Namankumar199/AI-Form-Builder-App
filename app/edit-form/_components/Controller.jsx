import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Themes from '@/app/_data/Themes'
import { SelectItemIndicator } from '@radix-ui/react-select';
import GradientBg from '@/app/_data/GradientBg';
import { Button } from '@/components/ui/button';


function Controller({ selectedTheme, selectedBackground }) {
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const [showMore, setShowMore] = useState(6);
    return (
        <div>
            {/* Theme Selection controller */}
            <h2 className='my-1'>Select Themes</h2>
            <Select onValueChange={(value) => selectedTheme(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {
                        Themes.map((theme, index) => (
                            <SelectItem value={theme.theme} key={index}>
                                <div className='flex gap-2'>
                                    <div className='flex'>
                                        <div className='h-5 w-5 rounded-l-md'
                                            style={{ backgroundColor: theme.primary }} >
                                        </div>

                                        <div className='h-5 w-5'
                                            style={{ backgroundColor: theme.secondary }} >
                                        </div>
                                        <div className='h-5 w-5'
                                            style={{ backgroundColor: theme.neutral }} >
                                        </div>
                                        <div className='h-5 w-5'
                                            style={{ backgroundColor: theme.accent }} >
                                        </div>

                                        <div className='h-5 w-5 rounded-r-md'
                                            style={{ backgroundColor: theme.info }} >
                                        </div>

                                    </div>
                                    {capitalize(theme.theme)}
                                </div>

                            </SelectItem>
                        ))

                    }
                </SelectContent>
            </Select>

            {/* Background Selection Controller */}
            <h2 className='mt-8 my-1'>Background</h2>
            <div className='grid grid-cols-3 gap-5'>
                {GradientBg.map((bg, index) => index < showMore && (
                    <div
                        key={index}
                        onClick={() => selectedBackground(bg.gradient)}
                        className='w-full h-[70px] rounded hover:border-black hover:border-2 flex items-center justify-center cursor-pointer'
                        style={{ background: bg.gradient }}>
                        {index == 0 && 'None'}
                    </div>
                ))}
            </div>
            <Button variant="ghost" size="sm"
                className="w-full my-3 hover:bg-slate-500 hover:text-white"
                onClick={() => setShowMore(showMore > 6 ? 6 : 20)}>
                {showMore > 6 ? 'Show Less' : 'Show More'}
            </Button>

        </div>
    )
}

export default Controller
