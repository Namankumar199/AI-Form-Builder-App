"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

import './Header.css';


function Header() {
  const { user, isSignedIn } = useUser();
  const path = usePathname();

  useEffect(() => {
    console.log(path)
  }, [])

  return !path.includes('aiform') && (
    <nav
      className='bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 shadow-lg shadow-blue-200/50 w-100 px-8 md:px-auto backdrop-blur-sm transition-all duration-300 hover:shadow-xl'
    >
      <div className='md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap animate-fade-in'
      >

        {/* <Image className='border rounded-lg' src={'/logo.png'} width={200} height={80} alt='logo' /> */}
        {/* <!-- Logo --> */}
        <div className="text-white md:order-1 transform hover:scale-110 transition-all duration-300 hover:rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>

        <div className="text-white order-3 w-full md:w-auto md:order-2">
          <ul className="flex font-semibold justify-between">
            <li className="md:px-4 md:py-2 text-white border-b-2 border-green-300 transform hover:scale-105 transition-all duration-200"><a href="#">Dashboard</a></li>
            <li className="md:px-4 md:py-2 hover:text-green-200 transform hover:scale-105 transition-all duration-200 hover:border-b-2 hover:border-green-300"><a href="#">Search</a></li>
            <li className="md:px-4 md:py-2 hover:text-green-200 transform hover:scale-105 transition-all duration-200 hover:border-b-2 hover:border-green-300"><a href="#">Explore</a></li>
            <li className="md:px-4 md:py-2 hover:text-green-200 transform hover:scale-105 transition-all duration-200 hover:border-b-2 hover:border-green-300"><a href="#">About</a></li>
            <li className="md:px-4 md:py-2 hover:text-green-200 transform hover:scale-105 transition-all duration-200 hover:border-b-2 hover:border-green-300"><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="order-2 md:order-3">
          <button className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-slow">
            {/* <!-- Heroicons - Login Solid --> */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>

            {isSignedIn ?
              <div className='flex gap-1 md:gap-3 items-center justify-between animate-fade-in'>
                <Link href={'/dashboard'} >
                  <span className="hover:text-green-200 transition-colors duration-200"> Dashboard </span>
                </Link>
                <div className="transform hover:scale-110 transition-all duration-200">
                  <UserButton />
                </div>
              </div>
              :
              <SignInButton>
                <span className='hover:text-green-200 transition-colors duration-200'>
                  Login
                </span>
              </SignInButton>
            }

          </button>


        </div>


      </div>
    </nav>
  )
};

export default Header
