import { Input } from '@/components/ui/input'
import React, { useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import FieldEdit from './FieldEdit'
import { db } from '@/configs'
import { userResponse } from '@/configs/schema'
import moment from 'moment'
import { toast } from 'sonner'


function FormUi({ jsonForm, selectedTheme, onFieldUpdate, deleteField, editable = true, formId = 0 }) {


    const [formData, setFormData] = useState();

    let formRef = useRef();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleCheckboxChange = (fieldName, itemName, value) => {
        console.log(fieldName, itemName, value);

        const list = formData?.[fieldName] ? formData?.[fieldName] : [];

        if (value) {
            list.push({
                label: itemName,
                value: value
            })
            setFormData({
                ...formData,
                [fieldName]: list
            })
        } else {

            const result = list.filter((item) => item.label == itemName);
            setFormData({
                ...formData,
                [fieldName]: result
            })
        }

    }



    const onFormSubmit = async (event) => {
        event.preventDefault();

        console.log(formData);

        const result = await db.insert(userResponse)
            .values({
                jsonResponse: formData,
                createdAt: moment().format('DD/MM/YYY'),
                formRef: formId

            })
        if (result) {
            formRef.reset();
            toast('Response Submitted SuccessFully..')
        } else {
            toast('Error While saving your form xx..')

        }

    }
    return (
        <form
            ref={(e) => formRef = e}
            onSubmit={onFormSubmit}
            className='border p-5 md:w-[600px] rounded-lg' data-theme={selectedTheme}>
            <h2 className='font-bold text-center text-2xl'>{jsonForm?.title}</h2>
            <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.subheading}</h2>

            {/* <h3>{jsonForm?.fields?.length}</h3> */}

            {jsonForm?.fields?.map((field, index) => (
                <div key={index} className='flex items-center gap-2'>
                    {
                        field.fieldType == "select" ?
                            <div className='my-3 w-full'>
                                <label className='text-sm text-gray-700 '>{field?.label}</label>
                                <Select required={field?.required}
                                    onValueChange={(v) => handleSelectChange(field?.label, v)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((item, index) => (
                                            <SelectItem key={index} value={item.value} > {item.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            :
                            field.fieldType == "radio" ?
                                <div className='my-3 w-full'>
                                    <label className='text-sm text-gray-700 '>{field?.label}</label>
                                    <RadioGroup required={field?.required}>
                                        {
                                            field.options.map((item, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={item.label} id={item.label}
                                                        onClick={(v) => handleSelectChange(field?.label, item.label)}
                                                    />
                                                    <Label htmlFor={item.label}> {item.label}</Label>
                                                </div>

                                            ))
                                        }
                                    </RadioGroup>
                                </div>
                                :
                                field.fieldType == "checkbox" ?
                                    <div className='my-3 w-full'>
                                        <label className='text-sm text-gray-700 '>{field?.label}</label>
                                        {
                                            field?.options ?
                                                field?.options?.map((item, index) => (
                                                    <div key={index} className='flex gap-2'>
                                                        <Checkbox
                                                            onCheckedChange={(v) => handleCheckboxChange(field?.label, item.label, v)} />
                                                        <h2>{item.label}</h2>
                                                    </div>
                                                ))
                                                :
                                                <div className='flex gap-2 items-center'>
                                                    <Checkbox required="true" />
                                                    <h2>{field.label}</h2>
                                                </div>
                                        }
                                    </div>
                                    :
                                    <div className='my-3 w-full'>
                                        <label className='text-sm text-gray-700 '>{field?.label}</label>
                                        <Input
                                            className='my-1 mb-3 bg-transparent'
                                            type={field?.fieldType}
                                            placeholder={field?.placeholder}
                                            name={field?.name}
                                            required={field?.required}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>}

                    {editable && <div>
                        <FieldEdit defaultValue={field}
                            onUpdate={(value) => onFieldUpdate(value, index)}
                            deleteField={() => deleteField(index)}
                        />
                    </div>
                    }
                </div >
            ))}

            {editable ?
                <button type='submit' className='btn btn-primary ' disabled> Live Submit </button>
                :
                <button type='submit' className='btn btn-primary'> Submit </button>

            }

        </form>

    )
}

export default FormUi
