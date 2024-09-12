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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


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
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(); // State for loading indicator
    const { user } = useUser();
    const route = useRouter();



    const onCreateForm = async () => {
        try {
            setLoading(true); // Set loading to true when creating form

            // Sending user input and prompt to AI chat session
            const result = await AiChatSession.sendMessage("Description: " + userInput + PROMPT);
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
            console.log(jsonString); // Logging response text from AI session

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
            setOpenDialog(false);
            setLoading(false);
            toast('error occured.!')
        } finally {
            setOpenDialog(false);
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Button to open the create form dialog */}
            <Button className='bg-blue-500' onClick={() => setOpenDialog(true)}>+ Create Form </Button>
            {/* Dialog for creating new form */}
            {/* onClose={() => setOpenDialog(false)} */}
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                        <DialogDescription>
                            {/* Textarea for user to input form description */}
                            <Textarea
                                className="my-2"
                                placeholder="Write description of your form.."
                                onChange={(event) => setUserInput(event.target.value)}
                            />
                            <div className='flex gap-3 items-end justify-end'>
                                {/* Button to cancel form creation */}
                                <Button variant="destructive" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                {/* Button to create form, disabled when loading */}
                                <Button onClick={() => onCreateForm()} disabled={loading}>
                                    {/* Loader icon from lucid-icons */}
                                    {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateForm;
