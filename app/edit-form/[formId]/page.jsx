"use client"

import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Share, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FormUi from '../_components/FormUi'
import { toast } from "sonner"
import Controller from '../_components/Controller'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RWebShare } from 'react-web-share'



function EditForm({ params }) {

    const { user } = useUser();
    const [jsonForm, setJsonForm] = useState([]);
    const router = useRouter();
    const [updateTrigger, setUpdateTrigger] = useState();
    const [record, setRecord] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(['light']);
    const [selectedBackground, setSelectedBackground] = useState();

    useEffect(() => {
        user && GetFormData();
    }, [user]);

    const GetFormData = async () => {
        const result = await db.select().from(JsonForms)
            .where(and(eq(JsonForms.id, params?.formId)),
                eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        console.log(result)
        setJsonForm(JSON.parse(result[0].jsonform));
        setRecord(result[0]);
        setSelectedBackground(result[0].background);
        setSelectedTheme(result[0].theme);
    }

    useEffect(() => {
        if (updateTrigger) {
            setJsonForm(jsonForm);
            updateJsonFormInDb();
        }

    }, [updateTrigger]);

    const onFieldUpdated = (value, index) => {
        jsonForm.fields[index].label = value.label;
        jsonForm.fields[index].placeholder = value.placeholder;
        // console.log(jsonForm);
        setUpdateTrigger(Date.now());
        toast("Field Updated Successfully..")
    }

    const updateJsonFormInDb = async () => {
        const result = await db.update(JsonForms)
            .set({
                jsonform: jsonForm
            }).where(and(eq(JsonForms.id, record.id),
                eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
            .returning({ id: JsonForms.id })
        toast('Updated..')
        console.log(result)
    }

    const deleteField = (indexToRemove) => {
        const result = jsonForm.fields.filter((item, index) => index != indexToRemove)
        console.log(result);
        jsonForm.fields = result;
        setUpdateTrigger(Date.now());
    }
    const updateControllerFields = async (value, columnName) => {
        const result = await db.update(JsonForms).set({
            [columnName]: value
        }).where(and(eq(JsonForms.id, record.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
            .returning({ id: JsonForms.id })
        toast('Updated..')
        console.log(result)
    }

    return (
        <div className='p-10 bg-gradient-to-br from-blue-50/30 via-teal-50/30 to-green-50/30 min-h-screen'>
            <div className='flex justify-between items-center'>
                <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent transform hover:scale-105 transition-all duration-300'
                    onClick={() => router.back()}>
                    <ArrowLeft /> Back
                </h2>
                <div className='flex gap-2 '>
             
                    <Link href={'/aiform/' + record?.id} target='_blank'>
                        <Button className='flex gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300'> <SquareArrowOutUpRight className='h-5 w-5' /> Live Preview</Button>
                    </Link>

                    <RWebShare
                        data={{
                            text: jsonForm?.subheading + " ,  Build your form in seconde not in hours",
                            url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
                            title: jsonForm?.title,
                        }}
                        onClick={() => console.log("shared successfully!")}
                     >
                        <Button className='flex gap-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300'> <Share className='h-5 w-5' /> Share</Button>
                    </RWebShare>
                </div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='p-5 border-2 border-teal-200 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in'>
                    <Controller
                        selectedTheme={(value) => {
                            updateControllerFields(value, 'theme')
                            setSelectedTheme(value)
                        }}
                        selectedBackground={(value) => {
                            updateControllerFields(value, 'background')
                            setSelectedBackground(value)
                        }}
                    />
                </div>

                <div className='md:col-span-2 border-2 border-teal-200 rounded-xl p-5 flex justify-center shadow-lg animate-fade-in'
                    style={{ backgroundImage: selectedBackground }}>
                    <FormUi jsonForm={jsonForm}
                        selectedTheme={selectedTheme}
                        onFieldUpdate={onFieldUpdated}
                        deleteField={(index) => deleteField(index)}
                        allFields={jsonForm?.fields || []}
                    />
                </div>
            </div>
        </div>
    )


}

export default EditForm
