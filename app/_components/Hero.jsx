import { Button } from '@/components/ui/button'
import { Edit, Share2, Sparkles } from 'lucide-react'
import React from 'react'

import './Hero.css';
import Footer from './Footer';

function Hero() {
  return (

    <section className="w-full flex flex-col">
      {/* Hero Section */}
      <div style={{ backgroundColor: '#fff' }}
        className='flex justify-center items-center rounded-lg min-h-screen  opacity-4 p-2 relative'>
        <div
          className="h-fit md:w-fit rounded-3xl py-10 md:p-20 shadow-md mx-4 
           hover:shadow-sm hover:shadow-blue-300 transition-all 
           absolute top-12 left-50 ">

          <div className="text-center p-5 md:p-10 ">
            <div >
              <h1 className="text-3xl md:text-6xl font-extrabold text-gray-600 sm:text-5xl tracking-wide flex flex-col md:flex-col">
                Create Your Form
                <strong className="font-extrabold text-blue-800 sm:block tracking-normal"> In Seconds Not in Hours </strong>
              </h1>

              <p className="mt-4 sm:text-xl/relaxed  py-5" style={{ color: 'gray', maxWidth: '500px', minWidth: '200px', margin: 'auto' }}>
                Design your own conversational AI forms  —— <span className='text-blue-900'> forfree!</span> Just share your ideas, and we’ll turn them into reality.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded px-12 py-3 text-md font-medium shadow text-gray-100 focus:outline-none focus:ring active:bg-transparent sm:w-auto bg-blue-500"
                href='#'
              >
                + Create AI Form

              </a>
              <a
                className="block w-full rounded px-12 py-3 text-md font-medium  border border-blue-900 shadow hover:text-gray-700 focus:outline-none focus:ring active:text-purple-700 sm:w-auto"
                href="#"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

      </div>


      {/* Card section */}
      <div
        style={{ backgroundColor: '#fff' }}
        className='h-fit w-screen flex flex-col items-center justify-center p-10 gap-9 relative'>
        {/* stars */}
        <div
          style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
          className='w-10 h-10 bg-slate-400 absolute top-5 left-5 z-0'>
        </div>

        <div
          style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
          className='w-10 h-10 bg-slate-400 absolute top-12 left-5 z-0'>
        </div>
        {/* stares end */}

        <div className='p-10 flex flex-col items-center justify-center z-10' >
          <h2 className='text-6xl text-center mt-10 text font-extrabold'> How it Works</h2>
          <h3 style={{ width: '350px' }} className='text-gray-400  mt-5 '>
            <span className='text-blue-400 text-lg'>
              AiForm Builder
            </span>
            &nbsp;lets you create free, conversational online forms. No coding needed — simply type your questions as naturally as having a conversation.

          </h3>
        </div>


        <div className='w-full flex flex-col gap-12 justify-center items-center lg:flex-row'>

          <div style={{ maxWidth: '400px', minWidth: '200px', maxHeight: '400px', minHeight: '240px' }}
            className='border-2 border-green-900  py-5 px-8 rounded-lg   shadow-xl  bg-blend-darken  
          transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-120 hover:bg-blue-500 hover:text-white duration-300     
         '>
            <Sparkles size={40} />
            <p className='font-extrabold text-lg mt-4'>Write prompt for your form </p>
            <p className='mt-1'>
              No more complex logic builders - just describe what you want and AiForm Builder will craft the perfect form for you.
            </p>
          </div>


          <div style={{ maxWidth: '400px', minWidth: '200px', maxHeight: '400px', minHeight: '240px' }} className='border-2 border-green-900  py-5 px-8 rounded-lg shadow-xl bg-blend-darken 
          transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-120 hover:bg-blue-500 hover:text-white duration-300 
          '>
            <Edit size={40} />
            <p className='font-extrabold text-lg mt-4'>Edit your form </p>
            <p className='mt-1'>
              Boring forms are a thing of the past - with AiForm Builder, your forms will feel more like a conversation rather than just another ordinary form.
            </p>
          </div>

          <div style={{ maxWidth: '400px', minWidth: '200px', maxHeight: '400px', minHeight: '240px' }} className='border-2 border-green-900  py-5 px-8 rounded-lg   shadow-xl  bg-blend-darken 
          transition ease-in-out delay-40 hover:-translate-y-1 hover:scale-120 hover:bg-blue-500 hover:text-white duration-600 
          '>
            <Share2 size={40} />
            <p className='font-extrabold text-lg mt-4'> Share & start Accepting Responses </p>
            <p className='mt-1'>
              Your forms automatically get a unique link that you can instantly share with anyone or simply link from your website.
            </p>
          </div>


        </div>
        <div className=''><Button className='bg-blue-500 hover:bg-blue-400'> Get Started Today </Button></div>
      </div>
      <Footer />
      
    </section>
  )
}

export default Hero
