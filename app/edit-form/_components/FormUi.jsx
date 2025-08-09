import { Input } from '@/components/ui/input'
import React, { useRef, useState, useEffect } from 'react'
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
import { FileUpload } from '@/components/ui/file-upload'
import { FormField, validateField } from '@/components/ui/form-validation'
import { getVisibleFields } from '@/lib/conditionalLogic'
import { MultiStepForm, createStepsFromFields } from '@/components/ui/multi-step-form'
import { sendEmailNotification } from '@/lib/emailService'
import { LoadingSpinner } from '@/components/ui/loading'
import { PaymentForm } from '@/components/ui/payment-form'


function FormUi({ jsonForm, selectedTheme, onFieldUpdate, deleteField, editable = true, formId = 0 }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibleFields, setVisibleFields] = useState([]);
    const [isMultiStep, setIsMultiStep] = useState(false);
    const [steps, setSteps] = useState([]);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    
    let formRef = useRef();

    useEffect(() => {
        if (jsonForm?.fields) {
            const visible = getVisibleFields(jsonForm.fields, formData);
            setVisibleFields(visible);
            
            // Auto-enable multi-step for forms with more than 6 fields
            if (visible.length > 6 && !editable) {
                setIsMultiStep(true);
                setSteps(createStepsFromFields(visible, 3));
            }
            
            // Check if form has payment enabled
            if (jsonForm.paymentEnabled && jsonForm.paymentAmount > 0) {
                setPaymentAmount(jsonForm.paymentAmount);
            }
        }
    }, [jsonForm, formData, editable]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newFormData = {
            ...formData,
            [name]: value
        };
        setFormData(newFormData);
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileUpload = (fieldName, files) => {
        setFormData({
            ...formData,
            [fieldName]: files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file) // In production, upload to cloud storage
            }))
        });
    };

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



    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        visibleFields.forEach(field => {
            const error = validateField(field, formData[field.name]);
            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const onFormSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        // Check if payment is required
        if (jsonForm.paymentEnabled && paymentAmount > 0 && !editable) {
            setShowPayment(true);
            return;
        }

        await submitForm();
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        
        try {
            // Save to database
            const result = await db.insert(userResponse)
                .values({
                    jsonResponse: JSON.stringify(formData),
                    createdAt: moment().format('DD/MM/YYYY'),
                    formRef: formId
                });

            if (result) {
                // Send email notification (if configured)
                try {
                    await sendEmailNotification(jsonForm, formData, 'admin@example.com');
                } catch (emailError) {
                    console.log('Email notification failed:', emailError);
                }

                formRef.current?.reset();
                setFormData({});
                setShowPayment(false);
                toast.success('Response submitted successfully!');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Error while saving your form');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        submitForm();
    };

    const handlePaymentError = () => {
        setShowPayment(false);
    };

    const renderField = (field, index, isInStep) => {
        const fieldError = errors[field.name];
        
        return (
            <div key={index} className={`flex items-start gap-2 ${isInStep ? '' : 'border-b border-gray-100 pb-4'}`}>
                <div className="flex-1">
                    {field.fieldType === "file" ? (
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <FileUpload
                                onFileSelect={(files) => handleFileUpload(field.name, files)}
                                maxFiles={field.maxFiles || 5}
                                acceptedTypes={field.acceptedTypes || ['image/*', '.pdf', '.doc', '.docx']}
                            />
                        </div>
                    ) : (
                        <FormField
                            field={field}
                            value={formData[field.name]}
                            onChange={(value) => {
                                const newFormData = { ...formData, [field.name]: value };
                                setFormData(newFormData);
                                if (fieldError) {
                                    setErrors(prev => ({ ...prev, [field.name]: null }));
                                }
                            }}
                            error={fieldError}
                        />
                    )}
                </div>
                
                {editable && (
                    <div className="flex-shrink-0">
                        <FieldEdit 
                            defaultValue={field}
                            onUpdate={(value) => onFieldUpdate(value, index)}
                            deleteField={() => deleteField(index)}
                        />
                    </div>
                )}
            </div>
        );
    };

    if (showPayment) {
        return (
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className='font-bold text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2'>
                        {jsonForm?.title}
                    </h2>
                    <p className='text-gray-600'>Complete payment to submit your form</p>
                </div>
                
                <PaymentForm
                    amount={paymentAmount}
                    formData={formData}
                    formId={formId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                />
                
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setShowPayment(false)}
                        className="text-gray-500 hover:text-gray-700 underline"
                    >
                        Back to form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form
            ref={formRef}
            onSubmit={onFormSubmit}
            className='border p-5 md:w-[600px] rounded-lg' data-theme={selectedTheme}>
            <h2 className='font-bold text-center text-2xl'>{jsonForm?.title}</h2>
            <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.subheading}</h2>

            {/* Multi-step form rendering */}
            {isMultiStep && !editable ? (
                <MultiStepForm
                    steps={steps.map((step, stepIndex) => ({
                        ...step,
                        content: (
                            <div className="space-y-4">
                                {step.fields.map((field, fieldIndex) => 
                                    renderField(field, fieldIndex, true)
                                )}
                            </div>
                        )
                    }))}
                    onSubmit={onFormSubmit}
                />
            ) : (
                // Regular form rendering
                <div className="space-y-4">
                    {visibleFields.map((field, index) => 
                        renderField(field, index, false)
                    )}
                    
                    {!editable && (
                        <button 
                            type='submit' 
                            disabled={isSubmitting}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Form'
                            )}
                        </button>
                    )}
                    
                    {editable && (
                        <button type='button' className='w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed' disabled>
                            Live Preview - Submit Disabled
                        </button>
                    )}
                </div>
            )}
        </form>
    );
}

export default FormUi
