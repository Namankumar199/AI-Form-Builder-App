"use client"
import React, { useEffect, useState } from 'react'
import FormList from '../_components/FormList'
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs';
import { desc, eq } from 'drizzle-orm';
import { JsonForms } from '@/configs/schema';
import FormListItem from '../_components/FormListItem';
import FormListItemResponses from './_components/FormListItemResponses';


function Responses() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        user && GetFormList();
    }, [user]);

    const GetFormList = async () => {
        const result = await db.select().from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(JsonForms.id));

        setFormList(result);
        console.log(result);

    }
    return (

        <div className='p-10 bg-gradient-to-br from-blue-50/50 via-teal-50/50 to-green-50/50 min-h-screen'>
            <h1 className='text-3xl font-bold flex items-center justify-between bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-fade-in'>
                Responses
            </h1>
            <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
                {
                    formList.map((form, index) => (
                        <div>

                            <FormListItemResponses
                                jsonForm={form?.jsonform ? JSON.parse(form.jsonform) : {}}
                                formRecord={form}
                                // refreshData={GetFormList}
                            />

                        </div>
                    ))
                }

            </div>

        </div>

    )
}

export default Responses
