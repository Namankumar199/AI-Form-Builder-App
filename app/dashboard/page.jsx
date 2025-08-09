import React from 'react'
import CreateForm from './_components/CreateForm'
import FormList from './_components/FormList'

function Dashboard() {
    return (
        <div className='p-10 bg-gray-50 min-h-screen'>
            <h1 className='text-3xl font-bold flex items-center justify-between text-gray-800 mb-6'>
                Dashboard
                <CreateForm />
            </h1>
            <FormList />
        </div>
    )
}

export default Dashboard
