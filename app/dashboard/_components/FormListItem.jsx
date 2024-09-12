import { Button } from '@/components/ui/button'
import { Edit, Share, Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms, userResponse } from '@/configs/schema'
import { toast } from 'sonner'
import { and, eq } from 'drizzle-orm'
import { RWebShare } from 'react-web-share'

function FormListItem({ formRecord, jsonForm, refreshData }) {

    const { user } = useUser();

    const onDeleteForm = async () => {

        const userResult = await db.delete(userResponse)
            .where(eq(userResponse.formRef, formRecord.id));

        if (userResult) {

            const result = await db.delete(JsonForms)
                .where(and(eq(JsonForms.id, formRecord.id)),
                    eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))

            if (result) {
                // console.log(result)
                toast('Form Deleted..')
                refreshData();
            } else {
                console.log('error.. occured')
            }
        } else {
            console.log('error occured..')
        }
    }


    return (

        <div className='border shadow-sm rounded-lg p-4'>
            <div className='flex justify-between'>
                <h2>
                </h2>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Trash className='h-5 w-5 text-red-500 cursor-pointer hover:scale-105 transition-all' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your form
                                and remove your data from  servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteForm()}> Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
            <h2 className='text-lg'>{jsonForm?.title}</h2>
            <h2 className='text-sm text-gray-500'>{jsonForm?.subheading}</h2>
            <hr className='my-4' />
            <div className='flex items-center justify-between'>
                <RWebShare
                    data={{
                        text: jsonForm?.subheading + " ,  Build your form in seconde not in hours",
                        url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + formRecord?.id,
                        title: jsonForm?.title,
                    }}
                    onClick={() => console.log("shared successfully!")}
                >
                    <Button variant="outline" size="sm" className='flex gap-2'>  <Share /> Share </Button>
                </RWebShare>

                <Link href={'/edit-form/' + formRecord?.id}>
                    <Button className='flex gap-2 bg-blue-500 hover:bg-blue-600' size="sm"> <Edit /> Edit </Button>
                </Link>

            </div>
        </div >
    )
}

export default FormListItem
