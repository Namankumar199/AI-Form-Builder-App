import React, { useEffect, useMemo } from 'react'
import { LibraryBig, LineChart, MessagesSquare, Shield, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import Link from 'next/link';


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
        name: "Team",
        icon: Users,
        path: '/dashboard/team'
    },
    {
        id: 5,
        name: "My Upgrade",
        icon: Shield,
        path: '/dashboard/upgrade'
    }
];

function SideNav() {
    const path = usePathname();

    return (
        <div className='h-screen shadow-lg border-r-2 border-teal-200 bg-gradient-to-b from-blue-50/50 to-green-50/50'>
            <div className='p-5'>
                {
                    menuList.map((menu, index) => (
                        <Link href={menu.path} key={index} className={`flex items-center gap-3 
                         p-4 mb-3 text-gray-600 cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg transition-colors duration-150
                         ${path == menu.path && 'bg-blue-500 text-white'} 
                         `}>
                            <menu.icon />
                            {menu.name}
                        </Link>

                    ))
                }
            </div>
            <div className='fixed bottom-7 p-6 w-64'>
                <Button className='w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300'>+ Create Form</Button>
                <div className='my-7'>
                    <Progress className='bg-gradient-to-r from-green-200 to-blue-200' value={55} />
                    <h2 className='text-sm mt-2 text-gray-600 '><strong>2</strong> Out of 3 File Created</h2>
                    <h2 className='text-sm mt-3 text-gray-600'>Upgrade your plan for unlimited Ai form build</h2>
                </div>
            </div>
        </div>
    )
}

export default SideNav