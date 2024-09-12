import React, { useEffect } from 'react'
import { LibraryBig, LineChart, MessagesSquare, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import Link from 'next/link';


function SideNav() {
    const menuList = [
        {
            id: 1,
            name: "My Form",
            icon: LibraryBig,
            path: '/dashboard'
        },
        {
            id: 2,
            name: "Responses",
            icon: MessagesSquare,
            path: '/dashboard/responses'
        },
        {
            id: 3,
            name: "Analytics",
            icon: LineChart,
            path: '/dashboard/analytics'
        },
        {
            id: 4,
            name: "My Upgrade",
            icon: Shield,
            path: '/dashboard/upgrade'
        }
    ]

    const path = usePathname();
    useEffect(() => {
        // console.log(path)
    }, [path])

    return (
        <div className='h-screen shadow-md border'>
            <div className='p-5'>
                {
                    menuList.map((menu, index) => (
                        <Link href={menu.path} key={index} className={`flex items-center gap-3 
                         p-4 mb-3 text-gray-500 cursor-pointer hover:bg-blue-600
                         hover:text-white rounded-lg
                         ${path == menu.path && 'bg-blue-500 text-white'} 
                         `}>
                            <menu.icon />
                            {menu.name}
                        </Link>

                    ))
                }
            </div>
            <div className='fixed bottom-7 p-6 w-64'>
                <Button className='w-full bg-blue-500'>+ Create Form</Button>
                <div className='my-7'>
                    <Progress className='bg-blue-300' value={55} />
                    <h2 className='text-sm mt-2 text-gray-600 '><strong>2</strong> Out of 3 File Created</h2>
                    <h2 className='text-sm mt-3 text-gray-600'>Upgrade your plan for unlimited Ai form build</h2>
                </div>
            </div>
        </div>
    )
}

export default SideNav