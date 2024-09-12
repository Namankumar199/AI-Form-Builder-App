import { Button } from '@/components/ui/button'
import { Download, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms, userResponse } from '@/configs/schema'
import { toast } from 'sonner'
import { and, eq } from 'drizzle-orm'
import * as XLSX from 'xlsx';


function FormListItemResponse({ formRecord, jsonForm }) {

    const { user } = useUser();
    let jsonData = [];

    const [totalResponse, setTotalResponse] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTotalResponses = async () => {
            try {
                const result = await db.select().from(userResponse)
                    .where(eq(userResponse.formRef, formRecord.id));

                setTotalResponse(result.length);
            } catch (error) {
                console.error('Error fetching responses:', error);
            }
        };

        fetchTotalResponses();
    }, [formRecord.id]);

    const ExportData = async () => {
        setLoading(true);

        const result = await db.select().from(userResponse)
            .where(eq(userResponse.formRef, formRecord.id));

        if (result) {
            result.forEach((item) => {
                const jsonItem = JSON.parse(item.jsonResponse);
                jsonData.push(jsonItem);
            })

            setLoading(false);
            console.log(jsonData);
            exportToExcel(jsonData);
            setTotalResponse(result.length);

        } else {

            console.log('error occured')
            setTimeout(() => {
                setLoading(false);
            }, 1000);

        }
    }

    // Convert Json to Excel and then Download it
    const exportToExcel = (jsonData) => {
        try {

            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            XLSX.writeFile(workbook, jsonForm?.title + '.xlsx');
        } catch (err) {
            console('error occured' + err)
        }

    }


    return (

        <div className='border shadow-sm rounded-lg p-4'>

            <h2 className='text-lg'>{jsonForm?.title}</h2>
            <h2 className='text-sm text-gray-500'>{jsonForm?.subheading}</h2>
            <hr className='my-4' />
            <div className='flex items-center justify-between'>
                <h2 variant="outline" size="sm" className='flex gap-1 tex-sm text-gray-700 '>
                    <strong> {totalResponse} </strong>
                    Responses
                </h2>
                <Button
                    onClick={() => ExportData()}
                    disabled={loading}
                    className='flex gap-2 bg-blue-500 hover:bg-blue-600' size="sm">
                    {loading ? <Loader /> : "Export"}
                    {/* // <Download /> */}

                </Button>


            </div>
        </div >
    )
}

export default FormListItemResponse
