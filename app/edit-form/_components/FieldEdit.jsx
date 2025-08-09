import { Edit, Trash, Settings, Zap } from 'lucide-react'
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ConditionalLogicEditor from './ConditionalLogicEditor'



function FieldEdit({ defaultValue, onUpdate, deleteField, allFields = [] }) {
    const [label, setLabel] = useState(defaultValue?.label);
    const [placeholder, setPlaceholder] = useState(defaultValue?.placeholder);
    const [required, setRequired] = useState(defaultValue?.required || false);
    const [fieldType, setFieldType] = useState(defaultValue?.fieldType || 'text');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [fieldData, setFieldData] = useState(defaultValue);

    const fieldTypes = [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'tel', label: 'Phone' },
        { value: 'number', label: 'Number' },
        { value: 'textarea', label: 'Textarea' },
        { value: 'select', label: 'Select' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'file', label: 'File Upload' }
    ];

    const handleUpdate = () => {
        onUpdate({
            ...fieldData,
            label,
            placeholder,
            required,
            fieldType
        });
    };

    const handleAdvancedUpdate = (updatedField) => {
        setFieldData(updatedField);
        onUpdate(updatedField);
    };

    return (
        <div className='flex gap-2'>
            {/* Quick Edit Popover */}
            <Popover>
                <PopoverTrigger>
                    <Edit className='h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer' />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">Quick Edit Field</h3>
                        
                        <div className="space-y-2">
                            <label className='text-sm font-medium text-gray-700'>Field Type</label>
                            <Select value={fieldType} onValueChange={setFieldType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fieldTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className='text-sm font-medium text-gray-700'>Label Name</label>
                            <Input 
                                type="text" 
                                value={label}
                                onChange={(e) => setLabel(e.target.value)} 
                                placeholder="Enter field label"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className='text-sm font-medium text-gray-700'>Placeholder</label>
                            <Input 
                                type="text" 
                                value={placeholder}
                                onChange={(e) => setPlaceholder(e.target.value)}
                                placeholder="Enter placeholder text"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="required" 
                                checked={required}
                                onCheckedChange={setRequired}
                            />
                            <label htmlFor="required" className="text-sm font-medium text-gray-700">
                                Required field
                            </label>
                        </div>

                        <Button 
                            size="sm" 
                            className='w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                            onClick={handleUpdate}
                        >
                            Update Field
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Advanced Settings Dialog */}
            <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
                <DialogTrigger>
                    <Settings className='h-5 w-5 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-600" />
                            Advanced Field Settings
                        </DialogTitle>
                        <DialogDescription>
                            Configure conditional logic and advanced options for this field
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        <ConditionalLogicEditor
                            field={fieldData}
                            allFields={allFields}
                            onUpdate={handleAdvancedUpdate}
                        />
                        
                        {fieldType === 'file' && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-800">File Upload Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Max Files</label>
                                        <Input 
                                            type="number" 
                                            min="1" 
                                            max="10"
                                            defaultValue={fieldData.maxFiles || 5}
                                            onChange={(e) => setFieldData({...fieldData, maxFiles: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Accepted Types</label>
                                        <Input 
                                            placeholder="image/*,.pdf,.doc"
                                            defaultValue={fieldData.acceptedTypes?.join(',') || 'image/*,.pdf'}
                                            onChange={(e) => setFieldData({...fieldData, acceptedTypes: e.target.value.split(',')})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Field */}
            <AlertDialog>
                <AlertDialogTrigger>
                    <Trash className='h-5 w-5 text-red-500 hover:text-red-700 transition-colors cursor-pointer' />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Field</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the field "{defaultValue?.label}"? 
                            This action cannot be undone and will remove the field from your form.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => deleteField()}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete Field
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default FieldEdit
