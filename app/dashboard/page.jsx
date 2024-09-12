import { Button } from '@/components/ui/button'
import React from 'react'
import CreateForm from './_components/CreateForm'
import FormList from './_components/FormList'

function Dashboard() {
    return (
        <div className='p-10'>
            <h1 className='text-3xl font-bold flex items-center justify-between text-gray-400'> Dashboard
                <CreateForm />
            </h1>
            <FormList />


        </div>
    )
}

export default Dashboard
