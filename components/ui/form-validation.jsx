"use client"
import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const FormField = ({ 
  field, 
  value, 
  onChange, 
  error, 
  className = "" 
}) => {
  const [touched, setTouched] = useState(false);
  
  const handleBlur = () => {
    setTouched(true);
  };

  const showError = touched && error;

  const baseInputClasses = `w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
    showError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
  } focus:outline-none focus:ring-2`;

  const renderField = () => {
    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={field.fieldType}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            className={baseInputClasses}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            className={`${baseInputClasses} min-h-[100px] resize-vertical`}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            className={baseInputClasses}
            required={field.required}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={handleBlur}
                  className="text-teal-600 focus:ring-teal-500"
                  required={field.required}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(currentValues.filter(v => v !== option.value));
                    }
                  }}
                  onBlur={handleBlur}
                  className="text-teal-600 focus:ring-teal-500 rounded"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            className={baseInputClasses}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {renderField()}
        {showError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
        {touched && !error && value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      
      {showError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export const validateField = (field, value) => {
  if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return `${field.label} is required`;
  }
  
  if (field.fieldType === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }
  
  if (field.fieldType === 'tel' && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
  }
  
  if (field.fieldType === 'number' && value) {
    if (isNaN(value)) {
      return 'Please enter a valid number';
    }
  }
  
  return null;
};