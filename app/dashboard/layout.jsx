"use client"
import { SignedIn } from '@clerk/nextjs'
import React, { memo } from 'react'
import SideNav from './_components/SideNav'

const MemoizedSideNav = memo(SideNav);

function DashboardLayout({ children }) {
    return (
        <div className='flex'>
            <div className='md:w-64 fixed h-screen'>
                <MemoizedSideNav />
            </div>
            <div className='md:ml-64 flex-1 min-h-screen'>
                <SignedIn>
                    {children}
                </SignedIn>
            </div>
        </div>
    )
}

export default DashboardLayout
