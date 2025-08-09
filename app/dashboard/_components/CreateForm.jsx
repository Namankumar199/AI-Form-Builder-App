"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AiChatSession } from '@/configs/AiModal';
import { useUser } from '@clerk/nextjs';
import { JsonForms } from '@/configs/schema';
import { db } from '@/configs';
import moment from 'moment';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { validateFormInput, validateFormData } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';
import { LoadingSpinner } from '@/components/ui/loading';
import TemplateSelector from './TemplateSelector';


// Prompt message to be appended to user input for form creation
const PROMPT = `{, Generate a JSON object for a form based on the following description. The JSON object should include:
- "title": The title of the form.
- "subheading": A brief subheading for the form.
- "fields": An array of form field objects, where each object includes:
  - "name": A unique identifier for the field.
  - "label": The text label for the field displayed on the form.
  - "placeholder": The placeholder text for the field (if applicable).
  - "fieldType": The type of field (e.g., "text", "email", "tel", "number", "radio", "select", "checkbox", "textarea").
  - "required": A boolean indicating whether the field is required (true or false).
  - "options": An array of option objects for fields like "select", "radio", or "checkbox", where each option object includes:
    - "value": The internal value of the option.
    - "label": The display label for the option.

Please ensure the JSON is correctly formatted with proper commas and brackets, and includes all necessary fields based on the given description. Example output:

{
  "title": "Example Form Title",
  "subheading": "Example Form Subheading",
  "fields": [
    {
      "name": "field1",
      "label": "Field Label 1",
      "placeholder": "Enter your input",
      "fieldType": "text",
      "required": true
    },
    {
      "name": "field2",
      "label": "Field Label 2",
      "placeholder": "Select an option",
      "fieldType": "select",
      "required": false,
      "options": [
        {
          "value": "option1",
          "label": "Option 1"
        },
        {
          "value": "option2",
          "label": "Option 2"
        }
      ]
    }
    // Add more fields as needed
  ]
}

Ensure there are no missing commas or extra commas or no extra space.
}`;

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false);
    const [showTemplates, setShowTemplates] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState();
    const { user } = useUser();
    const route = useRouter();



    const onCreateForm = async () => {
        try {
            setLoading(true);
            
            // Validate input
            const sanitizedInput = validateFormInput(userInput);
            if (sanitizedInput.length < 10) {
                throw new Error('Please provide a more detailed description (at least 10 characters)');
            }
            
            // Check rate limit
            checkRateLimit(user?.primaryEmailAddress?.emailAddress);

            // Sending user input and prompt to AI chat session
            const result = await AiChatSession.sendMessage("Description: " + sanitizedInput + PROMPT);
            const rawData = result.response.text();

            if (!rawData) {
                throw new Error('No response text from AI session.');
            }

            // Step 1: Locate the JSON boundaries
            const jsonStart = rawData.indexOf('{');
            const jsonEnd = rawData.lastIndexOf('}') + 1;

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error('No JSON data found in the provided string.');
            }

            // Step 2: Extract the JSON substring
            const jsonString = rawData.slice(jsonStart, jsonEnd);
            
            // Validate the generated form data
            const parsedForm = JSON.parse(jsonString);
            validateFormData(parsedForm);
            
            console.log(jsonString);

            // Insert into the database
            const resp = await db.insert(JsonForms).values({
                jsonform: jsonString,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('HH:mm:ss DD/MM/yyyy')
            }).returning({ id: JsonForms.id });

            if (!resp[0]?.id) {
                throw new Error('Failed to insert form into database.');
            }

            // Navigate to the edit form page
            route.push('/edit-form/' + resp[0].id);

        } catch (error) {
            console.error('Error creating form:', error);
            const errorMessage = error.message || 'An unexpected error occurred';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = async (template) => {
        try {
            setLoading(true);
            
            // Insert template directly into database
            const resp = await db.insert(JsonForms).values({
                jsonform: JSON.stringify(template.template),
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('HH:mm:ss DD/MM/yyyy')
            }).returning({ id: JsonForms.id });

            if (resp[0]?.id) {
                toast.success('Form created from template!');
                route.push('/edit-form/' + resp[0].id);
                setOpenDialog(false);
                setShowTemplates(true);
            }
        } catch (error) {
            console.error('Error creating form from template:', error);
            toast.error('Failed to create form from template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Button to open the create form dialog */}
            <Button className='bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl' onClick={() => { setOpenDialog(true); setShowTemplates(true); }}>+ Create Form </Button>
            {/* Dialog for creating new form */}
            {/* onClose={() => setOpenDialog(false)} */}
            <Dialog open={openDialog}>
                <DialogContent className='bg-gradient-to-br from-blue-50 to-green-50 border-2 border-teal-200 max-w-4xl max-h-[80vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle className='bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent text-xl font-bold'>
                            {showTemplates ? 'Create New Form' : 'Describe Your Form'}
                        </DialogTitle>
                        <DialogDescription>
                            {showTemplates ? (
                                <TemplateSelector 
                                    onSelectTemplate={handleTemplateSelect}
                                    onCreateFromScratch={() => setShowTemplates(false)}
                                />
                            ) : (
                                <div>
                                    {/* Textarea for user to input form description */}
                                    <Textarea
                                        className="my-2 border-teal-200 focus:border-teal-400"
                                        placeholder="Describe your form in detail (e.g., 'Create a contact form with name, email, phone, and message fields')..."
                                        onChange={(event) => setUserInput(event.target.value)}
                                        maxLength={5000}
                                    />
                                    <div className="text-sm text-gray-500 mb-2">
                                        {userInput.length}/5000 characters
                                    </div>
                                    <div className='flex gap-3 items-end justify-end'>
                                        <Button variant="outline" onClick={() => setShowTemplates(true)}>Back to Templates</Button>
                                        <Button variant="destructive" className='hover:scale-105 transition-all duration-200' onClick={() => { setOpenDialog(false); setShowTemplates(true); setUserInput(''); }}>Cancel</Button>
                                        <Button 
                                            className='bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed' 
                                            onClick={() => onCreateForm()} 
                                            disabled={loading || !userInput.trim() || userInput.length < 10}
                                        >
                                            {loading ? (
                                                <>
                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Create AI Form
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateForm;
